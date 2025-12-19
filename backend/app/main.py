from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging
import time

from .core.config import settings
from .database import init_db, close_db
from .api.v1 import auth, plans
from sqlalchemy import text
from .database import engine
import importlib
import importlib.util

# Dynamically import redis.asyncio at runtime to avoid static linter errors
Redis = None
if importlib.util.find_spec("redis.asyncio") is not None:
    try:
        _mod = importlib.import_module("redis.asyncio")
        Redis = getattr(_mod, "Redis", None)
    except Exception:
        Redis = None

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events"""
    # Startup
    logger.info("Starting zmooth...")
    # Mark not ready until initialization completes
    app.state.ready = False
    await init_db()
    logger.info("Database initialized")

    # Mark app as ready for readiness checks
    app.state.ready = True

    yield

    # Shutdown
    logger.info("Shutting down...")
    # mark not ready during shutdown
    app.state.ready = False
    await close_db()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Complete zmooth API",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Rate limiting middleware (basic)
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # TODO: Implement Redis-based rate limiting
    response = await call_next(request)
    return response


# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "message": "Validation error"
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "message": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.APP_ENV,
        "version": "1.0.0",
        "ready": getattr(app.state, "ready", False)
    }


# API Routes
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(plans.router, prefix=settings.API_V1_PREFIX)


@app.get("/ready")
async def readiness_probe():
    """Readiness probe: returns 200 when the app has completed startup tasks."""
    ready = getattr(app.state, "ready", False)
    if ready:
        # Active checks: DB and Redis
        # DB check
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
        except Exception:
            from fastapi import Response
            return Response(content='{"status":"db-unavailable"}', status_code=503, media_type="application/json")

        # Redis check (if redis lib available and REDIS_URL configured)
        if Redis and settings.REDIS_URL:
            try:
                r = Redis.from_url(settings.REDIS_URL)
                pong = await r.ping()
                await r.close()
                if not pong:
                    raise RuntimeError("redis ping failed")
            except Exception:
                from fastapi import Response
                return Response(content='{"status":"redis-unavailable"}', status_code=503, media_type="application/json")

        return {"status": "ready"}
    from fastapi import Response
    return Response(content='{"status":"initializing"}', status_code=503, media_type="application/json")

# TODO: Add these routers
# app.include_router(users.router, prefix=settings.API_V1_PREFIX)
# app.include_router(transactions.router, prefix=settings.API_V1_PREFIX)
# app.include_router(sessions.router, prefix=settings.API_V1_PREFIX)
# app.include_router(admin.router, prefix=settings.API_V1_PREFIX)
# app.include_router(vouchers.router, prefix=settings.API_V1_PREFIX)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
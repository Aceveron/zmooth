Stop + remove current containers and volumes (this will remove DB data):
# from repo root
docker compose -f docker/docker-compose.yaml down -v



Bring up db and redis with a known password (here changeme):
# ensure no DB_PASSWORD env var is set, then:
docker compose -f docker/docker-compose.yaml up -d db redis


cd backend
.\.venv\Scripts\Activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
cd backend
python -m venv .venv         # only if you haven't created it
.\.venv\Scripts\Activate


pip install -r requirements.txt

# development (auto-reload)
uvicorn main:app --reload

# or run without reload
python main.py

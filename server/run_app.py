# run_app.py
from app import create_app
from cache import load_cache_from_db

app = create_app()

with app.app_context():
    load_cache_from_db()

app.run(host="0.0.0.0", debug=True, port=3006)

import os
from dotenv import load_dotenv

load_dotenv()

# Persistent SQLite DB on Render
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////data/vehicles.db")

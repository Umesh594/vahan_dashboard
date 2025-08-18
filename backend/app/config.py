import os
from dotenv import load_dotenv

load_dotenv()

# Just read the full database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

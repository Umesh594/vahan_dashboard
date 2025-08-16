from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import vehicle, manufacturer  # your routers

app = FastAPI(title="Vehicle Registration API")

# --- CORS configuration ---
origins = [
    "http://localhost:8080",  # React/Vite dev server
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include routers ---
app.include_router(vehicle.router, prefix="/vehicle-data", tags=["Vehicle Data"])
app.include_router(manufacturer.router, prefix="/manufacturer-data", tags=["Manufacturer Data"])

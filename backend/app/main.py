from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import vehicle, growth  # vehicle.py & growth.py

app = FastAPI(title="Vehicle Registration Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicle.router, prefix="/vehicle-data", tags=["Vehicles"])
app.include_router(growth.router, prefix="/growth", tags=["Growth"])

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas

def get_manufacturer_data() -> list[schemas.VehicleRegistrationOut]:
    """
    Fetch all vehicle data grouped by manufacturer.
    """
    db: Session = SessionLocal()
    try:
        vehicles = crud.get_vehicle_data(db)
        # Convert SQLAlchemy models to Pydantic models
        return [schemas.VehicleRegistrationOut.from_orm(v) for v in vehicles]
    finally:
        db.close()

# Growth calculation is already here
from typing import List
from app.schemas import VehicleRegistrationOut, GrowthMetrics
from datetime import datetime

def calculate_growth(data: List[VehicleRegistrationOut]) -> GrowthMetrics:
    current_year = datetime.now().year
    current_quarter = (datetime.now().month - 1) // 3 + 1

    current_year_total = sum(d.registrations for d in data if d.year == current_year)
    previous_year_total = sum(d.registrations for d in data if d.year == current_year - 1)
    yoy = ((current_year_total - previous_year_total) / previous_year_total * 100) if previous_year_total > 0 else 0

    current_quarter_total = sum(d.registrations for d in data if d.year == current_year and d.quarter == current_quarter)
    previous_quarter_total = sum(d.registrations for d in data if d.year == current_year and d.quarter == current_quarter - 1)
    qoq = ((current_quarter_total - previous_quarter_total) / previous_quarter_total * 100) if previous_quarter_total > 0 else 0

    return GrowthMetrics(yoyGrowth=yoy, qoqGrowth=qoq, totalRegistrations=current_year_total)

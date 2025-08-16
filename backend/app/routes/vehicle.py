from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas, utils

router = APIRouter()

@router.get("/", response_model=list[schemas.VehicleRegistrationOut])
def get_all_vehicle_data(db: Session = Depends(get_db)):
    return crud.get_vehicle_data(db)

@router.get("/growth", response_model=schemas.GrowthMetrics)
def get_growth_metrics(db: Session = Depends(get_db)):
    data = crud.get_vehicle_data(db)
    return utils.calculate_growth(data)

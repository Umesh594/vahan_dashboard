from sqlalchemy.orm import Session
from app import models, schemas

def add_vehicle_data(db: Session, vehicle: schemas.VehicleRegistrationCreate):
    db_vehicle = models.VehicleRegistration(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

def get_vehicle_data(db: Session):
    return db.query(models.VehicleRegistration).all()

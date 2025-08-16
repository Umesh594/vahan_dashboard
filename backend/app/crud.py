from sqlalchemy.orm import Session
from app import models, schemas

def get_vehicle_data(db: Session):
    return db.query(models.VehicleRegistration).all()

def add_vehicle_data(db: Session, vehicle: schemas.VehicleRegistrationCreate):
    db_obj = models.VehicleRegistration(**vehicle.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

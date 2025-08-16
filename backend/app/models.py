from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class VehicleRegistration(Base):
    __tablename__ = "vehicle_registrations"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    vehicleType = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    registrations = Column(Integer, nullable=False)
    quarter = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

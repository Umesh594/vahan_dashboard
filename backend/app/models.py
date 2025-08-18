from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class VehicleRegistration(Base):
    __tablename__ = "vehicle_data"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    vehicle_type = Column(String(10), nullable=False)  # snake_case
    manufacturer = Column(String(100), nullable=False)
    registrations = Column(Integer, nullable=False)
    quarter = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

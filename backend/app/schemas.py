from pydantic import BaseModel
from datetime import date

class VehicleRegistrationBase(BaseModel):
    date: date
    vehicleType: str
    manufacturer: str
    registrations: int
    quarter: int
    year: int

class VehicleRegistrationCreate(VehicleRegistrationBase):
    pass

class VehicleRegistrationOut(VehicleRegistrationBase):
    id: int
    class Config:
        from_attributes = True  # v2 replacement for orm_mode

class GrowthMetrics(BaseModel):
    yoyGrowth: float
    qoqGrowth: float
    totalRegistrations: int

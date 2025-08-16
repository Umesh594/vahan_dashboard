from fastapi import APIRouter
from app import utils
from app.schemas import VehicleRegistrationOut
from typing import List

router = APIRouter()

@router.get("/", response_model=List[VehicleRegistrationOut])
def get_manufacturer_data():
    """
    Returns all manufacturer data in the same format as VehicleRegistration.
    """
    data = utils.get_manufacturer_data()
    return data

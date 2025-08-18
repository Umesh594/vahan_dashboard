from fastapi import APIRouter
from typing import Dict
from app import utils

router = APIRouter()

@router.get("/", response_model=Dict[str, Dict])
def get_growth():
    """
    Returns YoY & QoQ growth for total vehicles and per manufacturer.
    """
    return utils.calculate_growth_full()

from app.database import SessionLocal
from app import crud
from datetime import datetime

def get_manufacturer_data():
    db = SessionLocal()
    data = crud.get_vehicle_data(db)
    db.close()
    return data

def calculate_growth_full():
    db = SessionLocal()
    data = crud.get_vehicle_data(db)
    db.close()

    current_year = datetime.now().year
    current_quarter = (datetime.now().month - 1) // 3 + 1

    def calc_metrics(records):
        total_current_year = sum(d.registrations for d in records if d.year == current_year)
        total_previous_year = sum(d.registrations for d in records if d.year == current_year - 1)
        yoy = ((total_current_year - total_previous_year) / total_previous_year * 100) if total_previous_year else 0

        total_current_quarter = sum(d.registrations for d in records if d.year == current_year and d.quarter == current_quarter)
        total_previous_quarter = sum(d.registrations for d in records if d.year == current_year and d.quarter == current_quarter - 1)
        qoq = ((total_current_quarter - total_previous_quarter) / total_previous_quarter * 100) if total_previous_quarter else 0

        return {"yoyGrowth": yoy, "qoqGrowth": qoq, "totalRegistrations": total_current_year}

    overall = calc_metrics(data)

    per_manufacturer = {}
    for mfg in set(d.manufacturer for d in data):
        per_manufacturer[mfg] = calc_metrics([d for d in data if d.manufacturer == mfg])

    return {"overall": overall, "perManufacturer": per_manufacturer}

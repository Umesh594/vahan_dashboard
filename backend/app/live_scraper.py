import time
from datetime import date, datetime
from app.database import SessionLocal, engine, Base
from app import models, crud, schemas
import random

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Vehicle types and manufacturers
manufacturers = {
    "2W": ["Hero MotoCorp", "Honda", "TVS", "Bajaj", "Yamaha", "Royal Enfield"],
    "3W": ["Bajaj", "Mahindra", "Piaggio", "Force Motors", "Atul Auto"],
    "4W": ["Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra", "Toyota", "Kia"]
}

# Base registration numbers
base_numbers = {
    "2W": 1500,
    "3W": 800,
    "4W": 2000
}

# Growth trends per vehicle type
growth_trends = {
    "2W": 0.05,
    "3W": 0.0,
    "4W": 0.08
}

def generate_historical_data(start_year=2023, end_year=2025):
    """Generate data for all quarters of all years in the given range"""
    all_data = []
    for year in range(start_year, end_year + 1):
        for quarter in range(1, 5):
            month = (quarter - 1) * 3 + 1
            for vehicle_type, mfg_list in manufacturers.items():
                for mfg in mfg_list:
                    base = base_numbers[vehicle_type] * ((1 + growth_trends[vehicle_type]) ** (year - 2023))
                    registrations = int(base * random.uniform(0.8, 1.2))  # random fluctuation
                    all_data.append({
                        "date": date(year, month, 1),
                        "vehicleType": vehicle_type,
                        "manufacturer": mfg,
                        "registrations": registrations,
                        "quarter": quarter,
                        "year": year
                    })
    return all_data

def insert_data_to_db(data):
    db = SessionLocal()
    for record in data:
        vehicle = schemas.VehicleRegistrationCreate(**record)
        crud.add_vehicle_data(db, vehicle)
    db.close()

if __name__ == "__main__":
    print("Seeding database with historical data (2023–2025, all quarters)...")
    data = generate_historical_data()
    insert_data_to_db(data)
    print(f"Inserted {len(data)} records to DB.")
    
    # Optional: keep live scraping for current quarter
    while True:
        today = datetime.now()
        current_year = today.year
        current_quarter = (today.month - 1) // 3 + 1
        month = (current_quarter - 1) * 3 + 1

        live_data = []
        for vehicle_type, mfg_list in manufacturers.items():
            for mfg in mfg_list:
                base = base_numbers[vehicle_type] * ((1 + growth_trends[vehicle_type]) ** (current_year - 2023))
                registrations = int(base * random.uniform(0.8, 1.2))
                live_data.append({
                    "date": date(current_year, month, 1),
                    "vehicleType": vehicle_type,
                    "manufacturer": mfg,
                    "registrations": registrations,
                    "quarter": current_quarter,
                    "year": current_year
                })
        insert_data_to_db(live_data)
        print(f"[{datetime.now()}] Inserted {len(live_data)} live records to DB.")
        time.sleep(600)  # 10 minutes

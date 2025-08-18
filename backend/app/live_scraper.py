import time
from datetime import date, datetime
from app.database import SessionLocal, Base, engine
from app import crud, schemas
import random

Base.metadata.create_all(bind=engine)

manufacturers = {
    "2W": ["Hero MotoCorp", "Honda", "TVS", "Bajaj", "Yamaha", "Royal Enfield"],
    "3W": ["Bajaj", "Mahindra", "Piaggio", "Force Motors", "Atul Auto"],
    "4W": ["Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra", "Toyota", "Kia"]
}

base_numbers = {"2W": 1500, "3W": 800, "4W": 2000}
growth_trends = {"2W": 0.05, "3W": 0.02, "4W": 0.08}

def generate_historical_data(start_year=2023, end_year=2025):
    all_data = []
    for year in range(start_year, end_year + 1):
        for quarter in range(1, 5):
            month = (quarter - 1) * 3 + 1
            for vehicle_type, mfg_list in manufacturers.items():
                for mfg in mfg_list:
                    base = base_numbers[vehicle_type] * ((1 + growth_trends[vehicle_type]) ** (year - 2023))
                    registrations = int(base * random.uniform(0.8, 1.2))
                    all_data.append({
                        "date": date(year, month, 1),
                        "vehicle_type": vehicle_type,
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

def generate_live_data():
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
                "vehicle_type": vehicle_type,
                "manufacturer": mfg,
                "registrations": registrations,
                "quarter": current_quarter,
                "year": current_year
            })
    insert_data_to_db(live_data)
    print(f"[{datetime.now()}] Inserted {len(live_data)} live records.")

if __name__ == "__main__":
    # Seed historical data
    data = generate_historical_data()
    insert_data_to_db(data)
    print(f"Inserted {len(data)} historical records.")

    # Optional: live data every 10 min
    try:
        while True:
            generate_live_data()
            time.sleep(600)
    except KeyboardInterrupt:
        print("Live data generation stopped.")

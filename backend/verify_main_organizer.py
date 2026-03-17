
import requests
import datetime
import time

BASE_URL = "http://localhost:8000"

def verify_main_organizer():
    # 1. Register Normal Organizer
    normal_email = f"normal_org_{int(time.time())}@example.com"
    password = "password123"
    print(f"Registering normal organizer {normal_email}...")
    requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Normal Org",
        "email": normal_email,
        "password": password,
        "role": "organizer"
    })

    # Login Normal Org
    res = requests.post(f"{BASE_URL}/auth/token", data={"username": normal_email, "password": password})
    normal_token = res.json().get("access_token")

    # 2. Register Main Organizer
    main_email = "huzaifa.cds@gmail.com"
    print(f"Registering main organizer {main_email}...")
    # Try to register, ignore if already exists (might fail 400, but login should work)
    requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Huzaifa Main",
        "email": main_email,
        "password": password,
        "role": "organizer"
    })

    # Login Main Org
    res = requests.post(f"{BASE_URL}/auth/token", data={"username": main_email, "password": password})
    main_token = res.json().get("access_token")
    
    if not main_token:
        print("FAILED: Could not login as main organizer")
        return

    # 3. Normal Org Creates Event
    print("Normal Org creating event...")
    headers_normal = {"Authorization": f"Bearer {normal_token}"}
    event_data = {
        "title": "Normal Org Event",
        "description": "Event to be deleted",
        "category": "Test",
        "date_time": datetime.datetime.now().isoformat(),
        "venue": "Test Venue",
        "total_seats": 50,
        "price": 10.0
    }
    res = requests.post(f"{BASE_URL}/events/", json=event_data, headers=headers_normal)
    print(f"Create status: {res.status_code}")
    if res.status_code != 200:
        print(f"Failed to create event: {res.text}")
        return
    event_id = res.json()["id"]
    print(f"Event created with ID: {event_id}")

    # 4. Main Org Deletes Event
    print("Main Org attempting to delete event...")
    headers_main = {"Authorization": f"Bearer {main_token}"}
    res = requests.delete(f"{BASE_URL}/events/{event_id}", headers=headers_main)
    
    print(f"Delete Status: {res.status_code}")
    if res.status_code == 200:
        print("SUCCESS: Main organizer deleted the event.")
    else:
        print(f"FAILURE: {res.text}")

if __name__ == "__main__":
    verify_main_organizer()

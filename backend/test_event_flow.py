import requests
import datetime

BASE_URL = "http://localhost:8000"

def test_workflow():
    # 1. Register Organizer
    org_email = "organizer2@example.com"
    password = "password123"
    print(f"Registering organizer {org_email}...")
    try:
        res = requests.post(f"{BASE_URL}/auth/register", json={
            "name": "Org Name",
            "email": org_email,
            "password": password,
            "role": "organizer"
        })
        print(f"Register Status: {res.status_code}, Body: {res.text}")
    except Exception as e:
        print(f"Reg Error: {e}")

    # 2. Login
    print("Logging in...")
    token = ""
    try:
        res = requests.post(f"{BASE_URL}/auth/token", data={
            "username": org_email,
            "password": password
        })
        data = res.json()
        token = data.get("access_token")
        print(f"Login Status: {res.status_code}")
    except Exception as e:
        print(f"Login Error: {e}")
        return

    if not token:
        print("No token received.")
        return

    # 3. Create Event
    print("Creating Event...")
    headers = {"Authorization": f"Bearer {token}"}
    event_data = {
        "title": "Test Concert",
        "description": "A great show",
        "category": "Music",
        "date_time": datetime.datetime.now().isoformat(),
        "venue": "Stadium",
        "total_seats": 100,
        "price": 50.0
    }
    
    # NOTE: The frontend sends strings for numbers usually, let's test that hypothesis if strict fails
    # But first, let's try sending valid JSON types.
    try:
        res = requests.post(f"{BASE_URL}/events/", json=event_data, headers=headers)
        print(f"Create Event Status: {res.status_code}")
        print(f"Body: {res.text}")
    except Exception as e:
        print(f"Event Error: {e}")

if __name__ == "__main__":
    test_workflow()

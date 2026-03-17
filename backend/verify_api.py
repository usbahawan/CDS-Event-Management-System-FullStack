import requests

BASE_URL = "http://localhost:8000"

def test_register():
    print("Testing Registration...")
    payload = {
        "name": "Test User",
        "email": "testuser15@example.com",
        "password": "password123",
        "role": "attendee"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

def test_login():
    print("\nTesting Login...")
    payload = {
        "username": "testuser15@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/token", data=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_register()
    test_login()

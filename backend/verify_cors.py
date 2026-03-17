import requests

def test_cors():
    url = "http://localhost:8000/events/"
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
    }
    try:
        print(f"Testing OPTIONS {url}...")
        res = requests.options(url, headers=headers)
        print(f"Status: {res.status_code}")
        print("Headers:")
        for k, v in res.headers.items():
            if "access-control" in k.lower():
                print(f"{k}: {v}")
        
        if res.status_code == 200 and "access-control-allow-origin" in [k.lower() for k in res.headers.keys()]:
            print("\nCORS SUCCESS: Server is returning Access-Control headers.")
        else:
            print("\nCORS FAILURE: Missing headers or bad status.")
            
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_cors()

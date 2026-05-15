import requests

# 1. Register
url_register = "http://localhost:8000/register"
res_reg = requests.post(url_register, json={"name": "Test User", "email": "test_cart@example.com", "password": "password"})
print("Register:", res_reg.status_code, res_reg.text)

# 2. Login
url_login = "http://localhost:8000/login"
res_login = requests.post(url_login, data={"username": "test_cart@example.com", "password": "password"})
print("Login:", res_login.status_code, res_login.text)

token = res_login.json().get("access_token")

# 3. Add to cart
if token:
    url_cart = "http://localhost:8000/cart/"
    res_cart = requests.post(url_cart, json={"product_id": 1, "quantity": 1}, headers={"Authorization": f"Bearer {token}"})
    print("Add to cart:", res_cart.status_code, res_cart.text)
else:
    print("No token")

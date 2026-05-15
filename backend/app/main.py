from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import engine, Base
from app.routes import auth, products, cart, order, admin, seller, delivery as delivery_router
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.delivery import Delivery
from app.models.invoice import Invoice
from fastapi.staticfiles import StaticFiles
import os

# Create uploads directory if it doesn't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Saree Shopping API")

# Serve static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["Authentication"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(order.router, prefix="/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(seller.router, prefix="/seller", tags=["Seller"])
app.include_router(delivery_router.router, prefix="/delivery", tags=["Delivery"])

@app.get("/")
def root():
    return {"message": "Welcome to Saree Shopping API"}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.routes.auth import get_current_seller_user
from app.schemas.product import ProductResponse
from app.schemas.order import OrderResponse
from typing import List

router = APIRouter()

@router.get("/dashboard-stats")
def get_seller_stats(db: Session = Depends(get_db), current_seller: User = Depends(get_current_seller_user)):
    total_products = db.query(Product).filter(Product.seller_id == current_seller.id).count()
    total_orders = db.query(Order).filter(Order.seller_id == current_seller.id).count()
    total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.seller_id == current_seller.id).scalar() or 0.0
    
    return {
        "status": "ok", 
        "message": "Welcome to Seller Dashboard", 
        "seller_email": current_seller.email,
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }

from app.schemas.product import ProductCreate, ProductUpdate

@router.post("/products", response_model=ProductResponse)
def create_seller_product(
    product: ProductCreate, 
    db: Session = Depends(get_db), 
    current_seller: User = Depends(get_current_seller_user)
):
    product_data = product.dict(exclude={"seller_id", "is_approved"})
    # Auto-approve if the user is an admin
    is_approved = True if current_seller.role == "admin" else False
    new_product = Product(**product_data, seller_id=current_seller.id, is_approved=is_approved)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/products", response_model=List[ProductResponse])
def get_seller_products(db: Session = Depends(get_db), current_seller: User = Depends(get_current_seller_user)):
    return db.query(Product).filter(Product.seller_id == current_seller.id).all()

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_seller_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_seller: User = Depends(get_current_seller_user)
):
    product = db.query(Product).filter(Product.id == product_id, Product.seller_id == current_seller.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or access denied")
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_seller_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_seller: User = Depends(get_current_seller_user)
):
    product = db.query(Product).filter(Product.id == product_id, Product.seller_id == current_seller.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or access denied")
    
    db.delete(product)
    db.commit()
    return {"status": "ok", "message": "Product deleted"}

@router.get("/orders", response_model=List[OrderResponse])
def get_seller_orders(db: Session = Depends(get_db), current_seller: User = Depends(get_current_seller_user)):
    return db.query(Order).filter(Order.seller_id == current_seller.id).order_by(Order.created_at.desc()).all()

from app.schemas.order import OrderStatusUpdate
from fastapi import HTTPException

@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_seller_order_status(
    order_id: int, 
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db), 
    current_seller: User = Depends(get_current_seller_user)
):
    order = db.query(Order).filter(Order.id == order_id, Order.seller_id == current_seller.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found or access denied")
    
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order

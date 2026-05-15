from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserCreate
from app.routes.auth import get_current_admin_user
from app.auth.utils import get_password_hash
from app.models.order import Order
from app.schemas.order import OrderResponse, OrderStatusUpdate
from fastapi import HTTPException

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    return db.query(User).all()

@router.post("/sellers", response_model=UserResponse)
def create_seller(
    user: UserCreate, 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name, 
        email=user.email, 
        password_hash=hashed_password, 
        role="seller"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.delete("/sellers/{user_id}")
def delete_seller(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != "seller":
        raise HTTPException(status_code=400, detail="Only sellers can be deleted via this endpoint")
    
    db.delete(user)
    db.commit()
    return {"message": "Seller deleted successfully"}

@router.put("/users/{user_id}/verify", response_model=UserResponse)
def verify_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user

@router.put("/products/{product_id}/moderate")
def moderate_product(
    product_id: int,
    is_approved: bool,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    from app.models.product import Product
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.is_approved = is_approved
    db.commit()
    db.refresh(product)
    return {"message": "Product moderation status updated", "is_approved": product.is_approved}

@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    return db.query(Order).order_by(Order.created_at.desc()).all()

from app.schemas.product import ProductResponse

@router.get("/products", response_model=List[ProductResponse])
def get_all_products_for_admin(
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    from app.models.product import Product
    return db.query(Product).order_by(Product.id.desc()).all()

@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int, 
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order

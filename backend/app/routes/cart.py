from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.cart import CartItem
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemResponse
from .auth import get_current_user

router = APIRouter()

@router.post("/", response_model=CartItemResponse)
def add_to_cart(
    item: CartItemCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    from app.models.product import Product
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        


    # Check if item already exists in cart for this user
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    new_item = CartItem(
        user_id=current_user.id,
        product_id=item.product_id,
        quantity=item.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/", response_model=List[CartItemResponse])
def get_cart(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return db.query(CartItem).filter(CartItem.user_id == current_user.id).all()

@router.delete("/{id}")
def remove_from_cart(
    id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    item = db.query(CartItem).filter(
        CartItem.id == id,
        CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse
from .auth import get_current_user

router = APIRouter()

@router.post("/", response_model=List[OrderResponse])
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch user's cart items
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Group cart items by seller
    items_by_seller = {}
    for item in cart_items:
        seller_id = item.product.seller_id
        if seller_id not in items_by_seller:
            items_by_seller[seller_id] = []
        items_by_seller[seller_id].append(item)

    created_orders = []

    for seller_id, items in items_by_seller.items():
        # Calculate total amount for this seller's order
        total_amount = 0
        for item in items:
            price_to_use = item.product.bulk_price if item.product.bulk_price and item.quantity >= item.product.min_order_quantity else item.product.price
            total_amount += price_to_use * item.quantity

        # Create Order
        new_order = Order(
            user_id=current_user.id,
            seller_id=seller_id,
            full_name=order_data.full_name,
            address=order_data.address,
            city=order_data.city,
            zip_code=order_data.zip_code,
            total_amount=total_amount,
            status="pending",
            payment_status="pending"
        )
        db.add(new_order)
        db.flush() # To get new_order.id

        # Create Invoice
        from app.models.invoice import Invoice
        import uuid
        invoice = Invoice(
            order_id=new_order.id,
            invoice_number=f"INV-{uuid.uuid4().hex[:8].upper()}",
            total_amount=total_amount,
            status="issued"
        )
        db.add(invoice)

        # Create Delivery
        from app.models.delivery import Delivery
        delivery_partner = db.query(User).filter(User.role == "delivery").first()
        if delivery_partner:
            delivery = Delivery(
                order_id=new_order.id,
                delivery_partner_id=delivery_partner.id,
                status="assigned"
            )
            db.add(delivery)

        # Move cart items to order items
        for item in items:
            price_to_use = item.product.bulk_price if item.product.bulk_price and item.quantity >= item.product.min_order_quantity else item.product.price
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price_at_time=price_to_use
            )
            db.add(order_item)
            # Delete item from cart after moving to order
            db.delete(item)

        created_orders.append(new_order)

    db.commit()
    for order in created_orders:
        db.refresh(order)
    
    return created_orders

@router.get("/", response_model=List[OrderResponse])
def get_user_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()

@router.get("/{id}", response_model=OrderResponse)
def get_order(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

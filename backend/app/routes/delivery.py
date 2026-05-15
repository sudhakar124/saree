from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.user import User
from app.models.delivery import Delivery
from app.models.order import Order
from app.routes.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

async def get_current_delivery_user(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["delivery", "admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

class DeliveryStatusUpdate(BaseModel):
    status: str
    tracking_number: str = None
    proof_of_delivery_url: str = None
    notes: str = None
    driver_name: str = None
    vehicle_number: str = None
    route_info: str = None

from sqlalchemy.orm import joinedload

@router.get("/assigned")
def get_assigned_deliveries(db: Session = Depends(get_db), current_delivery: User = Depends(get_current_delivery_user)):
    deliveries = db.query(Delivery).options(joinedload(Delivery.order)).filter(Delivery.delivery_partner_id == current_delivery.id).all()
    
    result = []
    for d in deliveries:
        delivery_dict = {
            "id": d.id,
            "order_id": d.order_id,
            "delivery_partner_id": d.delivery_partner_id,
            "status": d.status,
            "tracking_number": d.tracking_number,
            "proof_of_delivery_url": d.proof_of_delivery_url,
            "notes": d.notes,
            "driver_name": d.driver_name,
            "vehicle_number": d.vehicle_number,
            "route_info": d.route_info,
            "created_at": d.created_at,
            "updated_at": d.updated_at,
            "address": d.order.address if d.order else "Unknown",
            "city": d.order.city if d.order else "Unknown"
        }
        result.append(delivery_dict)
    return result

@router.put("/{delivery_id}/status")
def update_delivery_status(
    delivery_id: int, 
    status_update: DeliveryStatusUpdate,
    db: Session = Depends(get_db), 
    current_delivery: User = Depends(get_current_delivery_user)
):
    delivery = db.query(Delivery).filter(Delivery.id == delivery_id, Delivery.delivery_partner_id == current_delivery.id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery not found")
        
    delivery.status = status_update.status
    if status_update.tracking_number:
        delivery.tracking_number = status_update.tracking_number
    if status_update.proof_of_delivery_url:
        delivery.proof_of_delivery_url = status_update.proof_of_delivery_url
    if status_update.notes:
        delivery.notes = status_update.notes
    if status_update.driver_name:
        delivery.driver_name = status_update.driver_name
    if status_update.vehicle_number:
        delivery.vehicle_number = status_update.vehicle_number
    if status_update.route_info:
        delivery.route_info = status_update.route_info
        
    db.commit()
    db.refresh(delivery)
    
    # Also sync order status if delivery is completed
    if delivery.status == "delivered":
        order = db.query(Order).filter(Order.id == delivery.order_id).first()
        if order:
            order.status = "delivered"
            db.commit()
            
    return delivery

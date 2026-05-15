from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderCreate(BaseModel):
    full_name: str
    address: str
    city: str
    zip_code: str

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_time: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    address: str
    city: str
    zip_code: str
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str


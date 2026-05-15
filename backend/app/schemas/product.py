from pydantic import BaseModel

from typing import Optional

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    image_url: str
    category: str
    is_featured: bool = False
    
    seller_id: Optional[int] = None
    bulk_price: Optional[float] = None
    min_order_quantity: int = 1
    inventory_count: int = 0
    is_approved: bool = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    bulk_price: Optional[float] = None
    min_order_quantity: Optional[int] = None
    inventory_count: Optional[int] = None

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

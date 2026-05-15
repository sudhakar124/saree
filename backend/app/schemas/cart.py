from pydantic import BaseModel
from .product import ProductResponse

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemResponse(CartItemBase):
    id: int
    user_id: int
    product: ProductResponse

    class Config:
        from_attributes = True

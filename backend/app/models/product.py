from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float) # Retail price
    image_url = Column(String)
    category = Column(String)
    is_featured = Column(Boolean, default=False)
    
    # B2B & Seller Fields
    seller_id = Column(Integer, ForeignKey("users.id"))
    bulk_price = Column(Float, nullable=True)
    min_order_quantity = Column(Integer, default=1)
    inventory_count = Column(Integer, default=0)
    is_approved = Column(Boolean, default=False) # Admin moderation
    
    seller = relationship("User", backref="products")

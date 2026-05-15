from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from app.database.session import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # Buyer
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Seller fulfilling
    delivery_partner_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Delivery role
    
    full_name = Column(String)
    address = Column(String)
    city = Column(String)
    zip_code = Column(String)
    total_amount = Column(Float)
    
    # Statuses: pending, accepted, processing, shipped, out_for_delivery, delivered, disputed, cancelled
    status = Column(String, default="pending")
    payment_status = Column(String, default="pending") # pending, completed, failed
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])
    seller = relationship("User", foreign_keys=[seller_id])
    delivery_partner = relationship("User", foreign_keys=[delivery_partner_id])
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price_at_time = Column(Float)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")

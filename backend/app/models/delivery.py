from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from app.database.session import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    delivery_partner_id = Column(Integer, ForeignKey("users.id"))
    
    status = Column(String, default="assigned") # assigned, picked_up, out_for_delivery, delivered, failed
    tracking_number = Column(String, nullable=True)
    proof_of_delivery_url = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    driver_name = Column(String, nullable=True)
    vehicle_number = Column(String, nullable=True)
    route_info = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    order = relationship("Order", backref="delivery_details")
    delivery_partner = relationship("User", foreign_keys=[delivery_partner_id])

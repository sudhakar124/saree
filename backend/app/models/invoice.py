from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from app.database.session import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    invoice_number = Column(String, unique=True, index=True)
    
    total_amount = Column(Float)
    tax_amount = Column(Float, default=0.0)
    commission_amount = Column(Float, default=0.0) # Admin commission
    
    status = Column(String, default="issued") # issued, paid, cancelled
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    due_date = Column(DateTime, nullable=True)

    order = relationship("Order", backref="invoice")

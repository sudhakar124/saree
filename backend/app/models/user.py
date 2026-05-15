from sqlalchemy import Column, Integer, String, Boolean
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="buyer") # admin, seller, buyer, delivery
    
    # Business & Verification Fields
    business_name = Column(String, nullable=True)
    gst_number = Column(String, nullable=True)
    shop_details = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    verification_documents_url = Column(String, nullable=True)

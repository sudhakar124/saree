from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse, ProductCreate

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import shutil
import os
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Create unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("uploads", unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/uploads/{unique_filename}"}

@router.get("/", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_approved == True)
    
    if category:
        query = query.filter(Product.category == category)
        
    if featured is not None:
        query = query.filter(Product.is_featured == featured)
        
    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "featured":
        # Usually we sort by featured desc to show featured items first
        query = query.order_by(Product.is_featured.desc())
        
    return query.all()

@router.get("/{id}", response_model=ProductResponse)
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse) # For initial seeding or admin
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

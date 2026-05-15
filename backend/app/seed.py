import os
import sys

# Add the current directory to the path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.session import SessionLocal, engine, Base
from app.models.product import Product

def seed():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have products
    if db.query(Product).count() > 0:
        print("Database already has products. Skipping seed.")
        db.close()
        return

    sample_products = [
        {
            "title": "Banarasi Silk Saree",
            "description": "Exquisite Banarasi silk saree with hand-woven gold zari motifs and a rich border. Perfect for weddings and grand festive occasions.",
            "price": 12500.0,
            "image_url": "/images/banarasi.png",
            "category": "Silk",
            "is_featured": True
        },
        {
            "title": "Kanchi Pattu Saree",
            "description": "Authentic Kanjeevaram silk saree from Tamil Nadu, known for its vibrant colors and durable silk fabric. Features traditional temple patterns.",
            "price": 18900.0,
            "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
            "category": "Silk"
        },
        {
            "title": "Chanderi Cotton Saree",
            "description": "Lightweight and breathable Chanderi cotton saree with subtle golden borders. Ideal for summer events and casual office wear.",
            "price": 3200.0,
            "image_url": "/images/chanderi.png",
            "category": "Cotton"
        },
        {
            "title": "Organza Floral Saree",
            "description": "Trendy organza saree featuring beautiful floral digital prints and a scalloped border. Soft, sheer, and very elegant.",
            "price": 4500.0,
            "image_url": "/images/organza.png",
            "category": "Organza",
            "is_featured": True
        },
        {
            "title": "Paithani Handloom Saree",
            "description": "Luxurious Paithani saree with its signature peacock motif on the pallu. A masterpiece of Maharashtrian handloom tradition.",
            "price": 25000.0,
            "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
            "category": "Silk"
        }
    ]

    for p in sample_products:
        product = Product(**p)
        db.add(product)
    
    db.commit()
    db.close()
    print("Database seeded successfully with sample sarees!")

if __name__ == "__main__":
    seed()

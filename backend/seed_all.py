from app.database.session import SessionLocal
from app.models.user import User
from app.models.product import Product
from app.auth.utils import get_password_hash

def seed_all():
    db = SessionLocal()
    
    # 1. Create Users
    users_data = [
        {"name": "System Admin", "email": "admin@saree.com", "password": "admin", "role": "admin", "business_name": None, "gst_number": None, "is_verified": True},
        {"name": "Top Seller", "email": "seller@saree.com", "password": "seller", "role": "seller", "business_name": "Saree World Wholesale", "gst_number": "22AAAAA0000A1Z5", "is_verified": True},
        {"name": "Bulk Buyer", "email": "buyer@saree.com", "password": "buyer", "role": "buyer", "business_name": "Boutique Fashion", "gst_number": "22BBBBB0000B1Z5", "is_verified": True},
        {"name": "Fast Delivery", "email": "delivery@saree.com", "password": "delivery", "role": "delivery", "business_name": None, "gst_number": None, "is_verified": True},
    ]

    for u_data in users_data:
        user = db.query(User).filter(User.email == u_data["email"]).first()
        if not user:
            hashed_password = get_password_hash(u_data["password"])
            user = User(
                name=u_data["name"], 
                email=u_data["email"], 
                password_hash=hashed_password, 
                role=u_data["role"],
                business_name=u_data["business_name"],
                gst_number=u_data["gst_number"],
                is_verified=u_data["is_verified"]
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created User: {u_data['email']} / {u_data['password']} ({u_data['role']})")
        else:
            print(f"User {u_data['email']} already exists.")

    # Get the seller to attach products to
    seller = db.query(User).filter(User.email == "seller@saree.com").first()

    # 2. Create Products
    products_data = [
        {
            "title": "Banarasi Silk Saree", 
            "price": 5999, 
            "bulk_price": 4500,
            "min_order_quantity": 10,
            "inventory_count": 500,
            "description": "Classic Banarasi silk saree with intricate gold zari work.", 
            "image_url": "/images/sarees/banarasi_silk.png", 
            "category": "Silk",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": True
        },
        {
            "title": "Kanjeevaram Saree", 
            "price": 8499, 
            "bulk_price": 7000,
            "min_order_quantity": 5,
            "inventory_count": 200,
            "description": "Traditional Kanjeevaram silk saree from South India.", 
            "image_url": "/images/sarees/kanjeevaram_silk.png", 
            "category": "Silk",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": True
        },
        {
            "title": "Chiffon Floral Saree", 
            "price": 2499, 
            "bulk_price": 1800,
            "min_order_quantity": 20,
            "inventory_count": 1000,
            "description": "Lightweight chiffon saree with elegant pastel floral prints.", 
            "image_url": "/images/sarees/chiffon_floral.png", 
            "category": "Chiffon",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": False
        },
        {
            "title": "Cotton Handloom Saree",
            "price": 1999,
            "bulk_price": 1500,
            "min_order_quantity": 25,
            "inventory_count": 800,
            "description": "Earthy toned Cotton Handloom Saree perfect for everyday wear.",
            "image_url": "/images/sarees/cotton_handloom.png",
            "category": "Cotton",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": True
        },
        {
            "title": "Georgette Designer Saree",
            "price": 4599,
            "bulk_price": 3800,
            "min_order_quantity": 10,
            "inventory_count": 400,
            "description": "Navy Blue Georgette Designer Saree, an ideal choice for party wear.",
            "image_url": "/images/sarees/georgette_designer.png",
            "category": "Georgette",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": False
        },
        {
            "title": "Mysore Silk Saree",
            "price": 6499,
            "bulk_price": 5000,
            "min_order_quantity": 8,
            "inventory_count": 300,
            "description": "Vibrant Orange Mysore Silk Saree showcasing premium silk heritage.",
            "image_url": "/images/sarees/mysore_silk.png",
            "category": "Silk",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": True
        },
        {
            "title": "Sambalpuri Ikat Saree",
            "price": 3299,
            "bulk_price": 2600,
            "min_order_quantity": 15,
            "inventory_count": 600,
            "description": "Black and Red geometric Sambalpuri Ikat Saree with traditional motifs.",
            "image_url": "/images/sarees/sambalpuri_ikat.png",
            "category": "Handloom",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": False
        },
        {
            "title": "Tant Saree",
            "price": 1499,
            "bulk_price": 1100,
            "min_order_quantity": 30,
            "inventory_count": 1200,
            "description": "Classic White and Red border Tant Saree, authentic Bengali style.",
            "image_url": "/images/sarees/tant_saree.png",
            "category": "Cotton",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": False
        },
        {
            "title": "Paithani Saree",
            "price": 9999,
            "bulk_price": 8500,
            "min_order_quantity": 5,
            "inventory_count": 150,
            "description": "Purple Paithani Saree adorned with a rich golden Peacock border.",
            "image_url": "/images/sarees/paithani_saree.png",
            "category": "Silk",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": True
        },
        {
            "title": "Patola Saree",
            "price": 8999,
            "bulk_price": 7600,
            "min_order_quantity": 5,
            "inventory_count": 100,
            "description": "Multicolor double ikat Patola Saree representing fine craftsmanship.",
            "image_url": "/images/sarees/patola_saree.png",
            "category": "Silk",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": False
        },
        {
            "title": "Net Embroidered Saree",
            "price": 5499,
            "bulk_price": 4600,
            "min_order_quantity": 12,
            "inventory_count": 350,
            "description": "Silver and Peach Net Embroidered Saree, perfect for weddings.",
            "image_url": "/images/sarees/net_embroidered.png",
            "category": "Net",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": True
        },
        {
            "title": "Tussar Silk Saree",
            "price": 4299,
            "bulk_price": 3500,
            "min_order_quantity": 10,
            "inventory_count": 450,
            "description": "Beige and Maroon Tussar Silk Saree known for its natural gold sheen.",
            "image_url": "/images/sarees/tussar_silk.png",
            "category": "Silk",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": False
        },
        {
            "title": "Linen Saree",
            "price": 2899,
            "bulk_price": 2300,
            "min_order_quantity": 20,
            "inventory_count": 700,
            "description": "Minimalist Grey and Yellow Linen Saree for a comfortable, chic look.",
            "image_url": "/images/sarees/linen_saree.png",
            "category": "Linen",
            "seller_id": seller.id,
            "is_approved": True,
            "is_featured": False
        }
    ]

    for p_data in products_data:
        product = db.query(Product).filter(Product.title == p_data["title"]).first()
        if not product:
            product = Product(**p_data)
            db.add(product)
            print(f"Created Product: {p_data['title']}")
        else:
            # update
            for k, v in p_data.items():
                setattr(product, k, v)
            print(f"Updated Product: {p_data['title']}")

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_all()

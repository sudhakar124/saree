from app.database.session import SessionLocal
from app.models.user import User
from app.auth.utils import get_password_hash

def seed_roles():
    db = SessionLocal()
    
    # Check if admin exists
    admin_email = "admin@saree.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        hashed_password = get_password_hash("admin123")
        admin = User(name="System Admin", email=admin_email, password_hash=hashed_password, role="admin")
        db.add(admin)
        print(f"Created Admin user: {admin_email} / admin123")
    else:
        # Update role if already exists
        admin.role = "admin"
        print(f"Admin user {admin_email} already exists, updated role.")

    # Check if seller exists
    seller_email = "seller@saree.com"
    seller = db.query(User).filter(User.email == seller_email).first()
    if not seller:
        hashed_password = get_password_hash("seller123")
        seller = User(name="First Seller", email=seller_email, password_hash=hashed_password, role="seller")
        db.add(seller)
        print(f"Created Seller user: {seller_email} / seller123")
    else:
        # Update role if already exists
        seller.role = "seller"
        print(f"Seller user {seller_email} already exists, updated role.")

    db.commit()
    db.close()

if __name__ == "__main__":
    seed_roles()

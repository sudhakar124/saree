import os
import sys

# Add the current directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.session import SessionLocal, engine, Base
from app.models.user import User
from app.auth.utils import get_password_hash

def debug():
    print("Testing registration logic...")
    try:
        db = SessionLocal()
        name = "Debug User"
        email = "debug@example.com"
        password = "password123"
        
        print(f"Checking if user {email} exists...")
        db_user = db.query(User).filter(User.email == email).first()
        if db_user:
            print("User already exists. Deleting for test.")
            db.delete(db_user)
            db.commit()
            
        print("Hashing password...")
        hashed = get_password_hash(password)
        print("Hashed successfully.")
        
        print("Creating User object...")
        new_user = User(name=name, email=email, password_hash=hashed)
        
        print("Adding to DB...")
        db.add(new_user)
        print("Committing...")
        db.commit()
        print("Refreshing...")
        db.refresh(new_user)
        print(f"Success! Created user ID: {new_user.id}")
        db.close()
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug()

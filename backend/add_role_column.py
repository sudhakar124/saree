import sqlite3

try:
    conn = sqlite3.connect('d:/frontend/saree/backend/saree.db')
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'buyer'")
    conn.commit()
    print("Successfully added role column")
except sqlite3.OperationalError as e:
    print(f"Error (maybe column already exists?): {e}")
finally:
    conn.close()

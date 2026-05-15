import sqlite3
import datetime

def insert_mock_delivery():
    conn = sqlite3.connect('saree.db')
    cursor = conn.cursor()
    
    now = datetime.datetime.utcnow().isoformat()
    
    try:
        cursor.execute(
            '''
            INSERT INTO deliveries (order_id, delivery_partner_id, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?)
            ''', 
            (6, 5, "assigned", now, now)
        )
        conn.commit()
        print("Successfully assigned Order #6 to delivery partner.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    insert_mock_delivery()

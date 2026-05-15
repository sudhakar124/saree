import sqlite3

def add_columns():
    conn = sqlite3.connect('saree.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute('ALTER TABLE deliveries ADD COLUMN driver_name VARCHAR')
        print("Added driver_name column")
    except sqlite3.OperationalError as e:
        print(f"driver_name column might already exist: {e}")
        
    try:
        cursor.execute('ALTER TABLE deliveries ADD COLUMN vehicle_number VARCHAR')
        print("Added vehicle_number column")
    except sqlite3.OperationalError as e:
        print(f"vehicle_number column might already exist: {e}")
        
    try:
        cursor.execute('ALTER TABLE deliveries ADD COLUMN route_info VARCHAR')
        print("Added route_info column")
    except sqlite3.OperationalError as e:
        print(f"route_info column might already exist: {e}")
        
    conn.commit()
    conn.close()
    print("Database update complete.")

if __name__ == "__main__":
    add_columns()

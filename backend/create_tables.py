from models import Base, engine

def create_tables():
    # Drop all tables to fix schema conflicts
    
    # Create new tables with corrected schema
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()
from models import Base, engine, StudentCourse, Group


def drop_specific_table():
    # Drop ONLY the Course table
    Group.__table__.drop(bind=engine)
    print(f"Dropped table: {StudentCourse.__tablename__}")


def create_tables():
   
    
    # Create new tables with corrected schema
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    #drop_specific_table()
    create_tables()
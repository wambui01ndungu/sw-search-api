from sqlalchemy import create_engine, text, inspect

db_url = "postgresql://my_search_database_user:8DqyFiaMh3KJgFkla2kKvEKJLvlx3cDv@dpg-d30jajffte5s73efsrh0-a.oregon-postgres.render.com/my_search_database_tkaq?sslmode=require"
engine = create_engine(db_url)

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1;"))
        print("Database connection successful:", result.fetchone())
except Exception as e:
    print("Database connection failed:", e)




inspector = inspect(engine)
print("Tables in the database:", inspector.get_table_names())

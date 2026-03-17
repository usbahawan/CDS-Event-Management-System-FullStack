import asyncio
import asyncpg
from sqlalchemy.ext.asyncio import create_async_engine
from models import Base
import os
from dotenv import load_dotenv

load_dotenv()

# We need to connect to default 'postgres' database first to create 'cds_db'
ADMIN_DB_URL = os.getenv("DATABASE_URL").replace("cds_db", "postgres")
TARGET_DB_NAME = "cds_db"

async def create_database():
    print(f"Connecting to {ADMIN_DB_URL} to create '{TARGET_DB_NAME}'...")
    try:
        # Connect to system database
        conn = await asyncpg.connect(ADMIN_DB_URL.replace("postgresql+asyncpg://", "postgresql://"))
        
        # Check if database exists
        exists = await conn.fetchval(f"SELECT 1 FROM pg_database WHERE datname = '{TARGET_DB_NAME}'")
        if not exists:
            print(f"Creating database {TARGET_DB_NAME}...")
            await conn.execute(f'CREATE DATABASE "{TARGET_DB_NAME}"')
            print("Database created successfully!")
        else:
            print(f"Database {TARGET_DB_NAME} already exists.")
        
        await conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")

if __name__ == "__main__":
    asyncio.run(create_database())

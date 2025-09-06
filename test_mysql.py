from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt  # optional for hashing passwords

uri = "mongodb+srv://supun00wick:Supunwick!@football.wyr5jhl.mongodb.net/?retryWrites=true&w=majority&appName=Football"

# Connect to MongoDB Atlas
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    exit()

db = client["Football"]  # match the existing DB name
users_collection = db["users"]

dummy_users = [
    {"email": "user1@example.com", "password": bcrypt.hashpw("pass123".encode(), bcrypt.gensalt()).decode(), "role": "user"},
    {"email": "user2@example.com", "password": bcrypt.hashpw("pass456".encode(), bcrypt.gensalt()).decode(), "role": "user"},
    {"email": "admin@example.com", "password": bcrypt.hashpw("admin123".encode(), bcrypt.gensalt()).decode(), "role": "admin"},
]

result = users_collection.insert_many(dummy_users)
print(f"Inserted {len(result.inserted_ids)} dummy users!")


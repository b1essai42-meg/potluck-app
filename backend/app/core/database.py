from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.MONGO_URI)
db = client["potluck"]

# インデックス設定
db.users.create_index("email", unique=True)
db.parties.create_index("owner_id")
db.parties.create_index("invite_token", unique=True)
db.items.create_index("party_id")

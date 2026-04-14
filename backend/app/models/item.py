from pydantic import BaseModel
from typing import Optional
from enum import Enum


class ItemStatus(str, Enum):
    preparing = "準備中"
    done = "完了"


class ItemCreate(BaseModel):
    name: str
    category: str
    quantity: str
    status: ItemStatus = ItemStatus.preparing


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[str] = None


class ItemResponse(ItemCreate):
    id: str
    party_id: str
    registered_by: str


class StatusUpdate(BaseModel):
    status: ItemStatus

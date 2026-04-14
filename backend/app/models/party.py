from pydantic import BaseModel
from typing import Optional, List


class PartyCreate(BaseModel):
    title: str
    date: Optional[str] = None
    memo: Optional[str] = None


class PartyUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    memo: Optional[str] = None


class PartyResponse(BaseModel):
    id: str
    title: str
    date: Optional[str] = None
    memo: Optional[str] = None
    owner_id: str
    invite_token: str
    members: List[str]
    created_at: str


class JoinRequest(BaseModel):
    invite_token: str

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatRequest(BaseModel):
    message: str
    model: str = "groq"  # "groq" or "gemini"
    workspace_id: int
    session_id: Optional[int] = None


class MessageOut(BaseModel):
    id: int
    session_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatSessionCreate(BaseModel):
    workspace_id: int


class ChatSessionOut(BaseModel):
    id: int
    title: str
    workspace_id: int
    created_at: datetime

    class Config:
        from_attributes = True

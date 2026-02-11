from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatRequest(BaseModel):
    message: str
    model: str = "groq"  # Options: "groq", "gemini-2.0-flash", "gemini-3.0", "gemini-3.0-flash"
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

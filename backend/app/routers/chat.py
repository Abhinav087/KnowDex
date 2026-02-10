from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.chat import ChatSession, Message
from app.models.paper import Paper
from app.schemas.chat import ChatRequest, MessageOut, ChatSessionOut
import groq
from google import genai

router = APIRouter(prefix="/chat", tags=["Chat"])


def get_groq_response(prompt: str, context: str) -> str:
    client = groq.Groq(api_key=settings.GROQ_API_KEY)
    completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert research assistant. Use the following paper context "
                    "to answer the user's question accurately and concisely.\n\n"
                    f"Paper Context:\n{context}"
                ),
            },
            {"role": "user", "content": prompt},
        ],
        model="llama-3.3-70b-versatile",
    )
    return completion.choices[0].message.content


def get_gemini_response(prompt: str, context: str) -> str:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=(
            f"You are an expert research assistant. Use this paper context to answer:\n\n"
            f"Paper Context:\n{context}\n\n"
            f"Question: {prompt}"
        ),
    )
    return response.text


@router.post("/sessions", response_model=ChatSessionOut)
def create_session(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ChatSession(workspace_id=workspace_id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/{workspace_id}", response_model=List[ChatSessionOut])
def list_sessions(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(ChatSession).filter(ChatSession.workspace_id == workspace_id).all()


@router.get("/messages/{session_id}", response_model=List[MessageOut])
def get_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Message)
        .filter(Message.session_id == session_id)
        .order_by(Message.created_at)
        .all()
    )


@router.post("/", response_model=MessageOut)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Build context from papers in workspace
    papers = db.query(Paper).filter(Paper.workspace_id == request.workspace_id).all()

    context_parts = []
    for p in papers:
        content = p.full_text if p.full_text and len(p.full_text) > 100 else p.abstract
        context_parts.append(
            f"Title: {p.title}\nAuthors: {p.authors}\nContent: {content[:10000]}"
        )  # Limit context per paper to avoid token limits

    context = "\n\n".join(context_parts)
    if not context:
        context = "No papers have been added to this workspace yet."

    # Get or create session
    session_id = request.session_id
    if not session_id:
        session = ChatSession(workspace_id=request.workspace_id)
        db.add(session)
        db.commit()
        db.refresh(session)
        session_id = session.id

    # Save user message
    user_msg = Message(session_id=session_id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()

    # Get AI response
    try:
        if request.model == "gemini":
            ai_text = get_gemini_response(request.message, context)
        else:
            ai_text = get_groq_response(request.message, context)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    # Save AI message
    ai_msg = Message(session_id=session_id, role="assistant", content=ai_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg

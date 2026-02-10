from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import pypdf
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.paper import Paper
from app.models.workspace import Workspace
from app.schemas.paper import PaperOut

router = APIRouter(prefix="/papers", tags=["Papers"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=PaperOut)
async def upload_paper(
    workspace_id: int = Form(...),
    title: str = Form(...),
    authors: Optional[str] = Form(""),
    abstract: Optional[str] = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ws = (
        db.query(Workspace)
        .filter(Workspace.id == workspace_id, Workspace.owner_id == current_user.id)
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    file_path = os.path.join(settings.UPLOAD_DIR, f"{workspace_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    full_text = ""
    try:
        reader = pypdf.PdfReader(file_path)
        for page in reader.pages:
            full_text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")

    paper = Paper(
        title=title,
        authors=authors or "",
        abstract=abstract or "",
        full_text=full_text,
        workspace_id=workspace_id,
        file_path=file_path,
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return paper


@router.get("/{workspace_id}", response_model=List[PaperOut])
def list_papers(
    workspace_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ws = (
        db.query(Workspace)
        .filter(Workspace.id == workspace_id, Workspace.owner_id == current_user.id)
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    return db.query(Paper).filter(Paper.workspace_id == workspace_id).all()


@router.delete("/{paper_id}")
def delete_paper(
    paper_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    ws = (
        db.query(Workspace)
        .filter(
            Workspace.id == paper.workspace_id, Workspace.owner_id == current_user.id
        )
        .first()
    )
    if not ws:
        raise HTTPException(status_code=403, detail="Not authorized")

    if paper.file_path and os.path.exists(paper.file_path):
        os.remove(paper.file_path)

    db.delete(paper)
    db.commit()
    return {"detail": "Paper deleted"}

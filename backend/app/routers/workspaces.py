from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceOut

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.post("/", response_model=WorkspaceOut)
def create_workspace(
    ws: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_ws = Workspace(
        name=ws.name, description=ws.description, owner_id=current_user.id
    )
    db.add(new_ws)
    db.commit()
    db.refresh(new_ws)
    return new_ws


@router.get("/", response_model=List[WorkspaceOut])
def list_workspaces(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Workspace).filter(Workspace.owner_id == current_user.id).all()


@router.get("/{workspace_id}", response_model=WorkspaceOut)
def get_workspace(
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
    return ws


@router.delete("/{workspace_id}")
def delete_workspace(
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
    db.delete(ws)
    db.commit()
    return {"detail": "Workspace deleted"}

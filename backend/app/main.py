from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, workspaces, papers, chat

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Knowdex AI API",
    description="Agentic AI Research Platform Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(workspaces.router, prefix="/api/v1")
app.include_router(papers.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Welcome to Knowdex AI API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

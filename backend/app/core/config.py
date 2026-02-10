from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./knowdex.db"

    # JWT
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # AI Keys
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Upload
    UPLOAD_DIR: str = "uploads"

    model_config = {
        "env_file": str(Path(__file__).resolve().parent.parent.parent.parent / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()

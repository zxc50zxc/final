from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "nabd-dev-secret-key-change-in-production"
    database_url: str = "sqlite:///./nabd.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()

import uuid
from pydantic import BaseModel

class Jugador(BaseModel):
    id: uuid.UUID | None = None
    nombre: str
    numero: int
    partidos_jugados: int | None = 0
    goles: int | None = 0
    asistencias: int | None = 0
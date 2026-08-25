import uuid
from pydantic import BaseModel

class Partido(BaseModel):
    id: uuid.UUID | None = None
    color: str
    equipo_lo: str
    equipo_vi: str
    fecha: str
    hora: str
    estado: str
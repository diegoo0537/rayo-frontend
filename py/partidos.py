import uuid
from fastapi import APIRouter, Body
from db import partidos_db
from clases.partido import Partido

router = APIRouter(
    prefix="/partidos",
    tags=["partidos"],
    responses={404: {"message": "No encontrado"}}
)

# GET /partidos
@router.get("/")
async def get_partidos():
    partidos = partidos_db.select("*").order("fecha").execute()
    return partidos.data

# POST /partidos
@router.post("/")
async def add_partido(partido:Partido):
    existe = partidos_db.select("fecha").eq("fecha", partido.fecha).execute()

    if existe.data:
        return False
    else:
        partido.id = uuid.uuid4()
        partido.estado = partido.estado.upper()
        partido.equipo_lo = partido.equipo_lo.upper()
        partido.equipo_vi = partido.equipo_vi.upper()

        data = partido.dict()
        data["id"] = str(data["id"])

        partidos_db.insert(data).execute()
        return True

# PUT /partidos/{fecha}
@router.put("/{fecha}")
async def update_partido(fecha: str, datos: dict = Body(...)):
    existe = partidos_db.select("fecha").eq("fecha", fecha).execute()

    if existe.data:
        datos["estado"] = datos["estado"].upper()

        # Eliminar campos que NO deben actualizarse
        datos.pop("id", None)
        datos.pop("equipo_lo", None)
        datos.pop("equipo_vi", None)

        # Eliminar valores null (no modificados)
        datos = {k: v for k, v in datos.items() if v is not None}

        partidos_db.update(datos).eq("fecha", fecha).execute()
        return True
    else:
        return False

# DELETE /partidos/{fecha}
@router.delete("/{fecha}")
async def delete_partido(fecha:str):
    existe = partidos_db.select("fecha").eq("fecha", fecha).execute()

    if existe.data:
        partidos_db.delete().eq("fecha", fecha).execute()
        return True
    else:
        return False
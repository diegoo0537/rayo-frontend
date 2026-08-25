import uuid
from fastapi import APIRouter, Body
from db import jugadores_db
from clases.jugador import Jugador

router = APIRouter(
    prefix="/jugadores",
    tags=["jugadores"],
    responses={404: {"message": "No encontrado"}}
)

# GET /jugadores
@router.get("/")
async def get_jugadores():
    jugadores = jugadores_db.select("*").order("numero").execute()
    return jugadores.data

# POST /jugadores
@router.post("/")
async def add_jugador(jugador:Jugador):
    existe = jugadores_db.select("numero").eq("numero", jugador.numero).execute()

    if existe.data:
        return False
    else:
        jugador.id = uuid.uuid4()
        jugador.nombre = jugador.nombre.upper()

        data = jugador.dict()
        data["id"] = str(data["id"])

        jugadores_db.insert(data).execute()
        return True

# PUT /jugadores/{numero}
@router.put("/{numero}")
async def update_jugador(numero: int, datos: dict = Body(...)):
    existe = jugadores_db.select("numero").eq("numero", numero).execute()

    if existe.data:
        # Eliminar campos que NO deben actualizarse
        datos.pop("id", None)
        datos.pop("nombre", None)
        datos.pop("numero", None)

        # Eliminar valores null (no modificados)
        datos = {k: v for k, v in datos.items() if v is not None}

        jugadores_db.update(datos).eq("numero", numero).execute()
        return True
    else:
        return False

# DELETE /jugadores/{numero}
@router.delete("/{numero}")
async def delete_jugador(numero:int):
    existe = jugadores_db.select("numero").eq("numero", numero).execute()

    if existe.data:
        jugadores_db.delete().eq("numero", numero).execute()
        return True
    else:
        return False
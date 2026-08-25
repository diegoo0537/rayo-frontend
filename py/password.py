import bcrypt
from fastapi import APIRouter

router = APIRouter(
    prefix="/password",
    tags=["password"],
    responses={404: {"message": "No encontrado"}}
)

hashed_password = bcrypt.hashpw("rayohtz".encode(), bcrypt.gensalt())

@router.get("/")
async def verificar_password(intento_password: str):
    intento_bytes = intento_password.encode()

    if bcrypt.checkpw(intento_bytes, hashed_password):
        return True
    else:
        return False
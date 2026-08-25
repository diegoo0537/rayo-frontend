from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

import jugadores, partidos, estadisticas, password

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(password.router)
app.include_router(jugadores.router)
app.include_router(partidos.router)
app.include_router(estadisticas.router)

# https://rayo-api.onrender.com/
# http://127.0.0.1:8000/
@app.get("/")
async def root():
    return "Rayo de Hortaleza"
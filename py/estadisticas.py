from collections import Counter
import io
import matplotlib.ticker as ticker
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from fastapi import APIRouter
from fastapi.responses import Response

from db import jugadores_db, partidos_db

router = APIRouter(
    prefix="/estadisticas",
    tags=["estadisticas"],
    responses={404: {"message": "No encontrado"}}
)

# GET /estadisticas/jugadores/partidos
@router.get("/jugadores/partidos")
async def get_partidos_x_jugador():
    jugadores = jugadores_db.select("*").order("partidos_jugados", desc=True).execute().data
    df = pd.DataFrame(jugadores)

    plt.figure(figsize=(10, 5))

    if df["partidos_jugados"].sum() == 0:
        sns.barplot(
            data=df,
            x="nombre",
            y="partidos_jugados",
            color="#0057b8"
        )
        plt.ylim(0, 1)
    else:
        sns.barplot(
            data=df,
            x="nombre",
            y="partidos_jugados",
            color="#0057b8"
        )

    plt.xlabel("")
    plt.ylabel("PARTIDOS JUGADOS")
    plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.25)

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    return Response(content=buf.getvalue(), media_type="image/png")

# GET /estadisticas/jugadores/goles
@router.get("/jugadores/goles")
async def get_goles_x_jugador():
    jugadores = jugadores_db.select("*").order("goles", desc=True).execute().data
    df = pd.DataFrame(jugadores)

    df["nombre"] = pd.Categorical(df["nombre"], categories=df["nombre"], ordered=True)

    plt.figure(figsize=(10, 5))

    if df["goles"].sum() == 0:
        sns.barplot(
            data=df,
            x="nombre",
            y="goles",
            color="#0057b8"
        )

        plt.ylim(0, 1)
    else:
        sns.barplot(
            data=df,
            x="nombre",
            y="goles",
            color="#0057b8"
        )

    plt.xlabel("")
    plt.ylabel("GOLES")
    plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.25)

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    return Response(content=buf.getvalue(), media_type="image/png")

# GET /estadisticas/jugadores/asistencias
@router.get("/jugadores/asistencias")
async def get_aistencias_x_jugador():
    jugadores = jugadores_db.select("*").order("asistencias", desc=True).execute().data
    df = pd.DataFrame(jugadores)

    df["nombre"] = pd.Categorical(df["nombre"], categories=df["nombre"], ordered=True)

    plt.figure(figsize=(10, 5))
    if df["asistencias"].sum() == 0:
        sns.barplot(
            data=df,
            x="nombre",
            y="asistencias",
            color="#0057b8"
        )

        plt.ylim(0, 1)
    else:
        sns.barplot(
            data=df,
            x="nombre",
            y="asistencias",
            color="#0057b8"
        )

    plt.xlabel("")
    plt.ylabel("ASISTENCIAS")
    plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.25)

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    return Response(content=buf.getvalue(), media_type="image/png")

# GET /estadisticas/jugadores/goles_asistencias
@router.get("/jugadores/goles_asistencias")
async def get_goles_istencias_x_jugador():
    jugadores = jugadores_db.select("*").execute().data

    # Crear columna G+A
    for j in jugadores:
        j["ga"] = j["goles"] + j["asistencias"]

    df = pd.DataFrame(jugadores)
    df = df.sort_values("ga", ascending=False)

    df["nombre"] = pd.Categorical(df["nombre"], categories=df["nombre"], ordered=True)

    plt.figure(figsize=(10, 5))

    if df["ga"].sum() == 0:
        sns.barplot(
            data=df,
            x="nombre",
            y="ga",
            color="#0057b8"
        )

        plt.ylim(0, 1)
    else:
        sns.barplot(
            data=df,
            x="nombre",
            y="ga",
            color="#0057b8"
        )

    plt.xlabel("")
    plt.ylabel("GOLES + ASISTENCIAS")
    plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.25)

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    return Response(content=buf.getvalue(), media_type="image/png")

# GET /estadisticas/partidos
@router.get("/partidos")
async def get_partidos():
    partidos = partidos_db.select("*").execute().data

    estados_fijos = ["GANADO", "EMPATADO", "PERDIDO"]
    conteo = Counter(p["estado"] for p in partidos if p["estado"] != "NO JUGADO")
    cantidades = [conteo.get(estado, 0) for estado in estados_fijos]

    df = pd.DataFrame({
        "estado": estados_fijos,
        "cantidad": cantidades
    })

    plt.figure(figsize=(10, 5))

    if sum(cantidades) == 0:
        plt.bar(estados_fijos, [0, 0, 0], color="#0057b8")
        plt.ylim(0, 1)
        plt.yticks([0])
    else:
        sns.barplot(
            data=df,
            x="estado",
            y="cantidad",
            palette=["#0057b8"] * len(estados_fijos)
        )

    plt.xlabel("")
    plt.ylabel("NUMERO DE PARTIDOS")
    plt.gca().yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    plt.tight_layout()
    plt.subplots_adjust(bottom=0.20)

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    return Response(content=buf.getvalue(), media_type="image/png")
from supabase import create_client
from dotenv import load_dotenv
import os

#load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("No se encontraron las variables de entorno de Supabase")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

jugadores_db = supabase.schema("public").table("jugadores")
partidos_db = supabase.schema("public").table("partidos")
from app.repositories.json_repo import JSONRepository
from app.models.schemas import Producto, Cliente
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from datetime import datetime
import uuid

class MinimercadoService:
    def __init__(self):
        self.repo_prod = JSONRepository("data/productos.json")
        self.repo_cli = JSONRepository("data/clientes.json")
        self.repo_ventas = JSONRepository("data/ventas.json")
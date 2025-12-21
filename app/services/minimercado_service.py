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

    def listar_inventario(self):
        return self.repo_prod.get_all()

    def agregar_producto(self, producto: Producto):
        productos = self.repo_prod.get_all()
        if any(p['id'] == producto.id for p in productos):
            raise HTTPException(status_code=400, detail="ID ya registrado.")
        if any(p['codigoBarras'] == producto.codigoBarras for p in productos):
            raise HTTPException(status_code=400, detail="Código de barras ya existe.")
        
        productos.append(jsonable_encoder(producto))
        self.repo_prod.save_all(productos)
        return producto
    
    def actualizar_producto(self, producto_id: str, datos: dict):
        productos = self.repo_prod.get_all()
        for p in productos:
            if p['id'] == producto_id:
                p.update(datos)
                self.repo_prod.save_all(productos)
                return p
        raise HTTPException(status_code=404, detail="No encontrado")
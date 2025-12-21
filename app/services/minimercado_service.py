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
    
    def eliminar_producto(self, producto_id: str):
        productos = self.repo_prod.get_all()
        nueva_lista = [p for p in productos if p['id'] != producto_id]
        if len(nueva_lista) == len(productos):
            raise HTTPException(status_code=404, detail="No encontrado")
        self.repo_prod.save_all(nueva_lista)
        return {"message": "Eliminado exitosamente"}
    
    def recibir_mercancia(self, producto_id: str, cantidad: int):
        """Aumenta stock por llegada de proveedor [cite: 411]"""
        productos = self.repo_prod.get_all()
        for p in productos:
            if p['id'] == producto_id:
                p['stock'] += cantidad
                self.repo_prod.save_all(productos)
                return p
        raise HTTPException(status_code=404, detail="No encontrado")
    
    def registrar_cliente(self, cliente: Cliente):
        clientes = self.repo_cli.get_all()
        if any(c['id'] == cliente.id for c in clientes):
            raise HTTPException(status_code=400, detail="Cliente ya existe")
        clientes.append(jsonable_encoder(cliente))
        self.repo_cli.save_all(clientes)
        return cliente
    
    def calcular_valor_total(self):
        """Reporte de valorización [cite: 508]"""
        productos = self.repo_prod.get_all()
        total = sum(float(p['precio']) * int(p['stock']) for p in productos)
        return {"valor_total_inventario": round(total, 2), "items": len(productos)}
    
    def procesar_venta_completa(self, cliente_id: str, carrito: list):
        """Valida stock, cliente, genera factura y suma puntos [cite: 425, 458, 504]"""
        productos = self.repo_prod.get_all()
        clientes = self.repo_cli.get_all()
        
        cliente = next((c for c in clientes if c['id'] == cliente_id), None)
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no registrado")

        detalles = []
        total_venta = 0

        for item in carrito:
            prod = next((p for p in productos if p['id'] == item['id']), None)
            if not prod or prod['stock'] < item['cantidad']:
                raise HTTPException(status_code=400, detail=f"Stock insuficiente: {item['id']}")
            
            sub = prod['precio'] * item['cantidad']
            total_venta += sub
            prod['stock'] -= item['cantidad']
            
            detalles.append({
                "producto_id": prod['id'],
                "nombre_producto": prod['nombre'],
                "cantidad": item['cantidad'],
                "precio_unitario": prod['precio'],
                "subtotal": round(sub, 2)
            })

        venta = {
            "id_factura": str(uuid.uuid4())[:8].upper(),
            "fecha": datetime.now().isoformat(),
            "cliente_id": cliente_id,
            "items": detalles,
            "total": round(total_venta, 2)
        }

        ventas = self.repo_ventas.get_all()
        ventas.append(venta)
        self.repo_ventas.save_all(ventas)
        self.repo_prod.save_all(productos)
        
        cliente['puntosFidelidad'] += int(total_venta // 10)
        self.repo_cli.save_all(clientes)
        return venta
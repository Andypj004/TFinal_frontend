from fastapi import APIRouter, Depends, Body
from app.models.schemas import Producto, ProductoUpdate, Cliente, ItemCarrito, Venta
from app.services.minimercado_service import MinimercadoService

# Eliminamos el prefijo global para manejar prefijos por función
router = APIRouter()

def get_service():
    return MinimercadoService()

# --- ÁREA: CATÁLOGO (Rol: Administrador) ---
@router.get(
    "/catalogo",
    tags=["Catálogo de Productos"],
    summary="Listar productos del catálogo",
    response_model=list[Producto]
)
def listar_productos(service: MinimercadoService = Depends(get_service)):
    return service.listar_inventario()


@router.post(
    "/catalogo/crear",
    tags=["Catálogo de Productos"],
    summary="Registrar un nuevo producto",
    response_model=Producto
)
def crear(producto: Producto, service: MinimercadoService = Depends(get_service)):
    return service.agregar_producto(producto)


@router.delete(
    "/catalogo/eliminar/{id}",
    tags=["Catálogo de Productos"],
    summary="Eliminar producto del catálogo",
    description="Elimina un producto existente mediante su ID."
)
def eliminar_producto(
    id: str,
    service: MinimercadoService = Depends(get_service)
):
    return service.eliminar_producto(id)



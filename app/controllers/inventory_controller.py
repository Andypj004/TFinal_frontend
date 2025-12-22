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

# --- ÁREA: INVENTARIO (Rol: Inventarista) ---
@router.post(
    "/inventario/recepcion/{id}",
    tags=["Gestión de Inventario"],
    summary="Registrar recepción de mercancía",
    description="Aumenta el stock de un producto por llegada de proveedor."
)
def recibir_stock(
    id: str,
    cantidad: int,
    service: MinimercadoService = Depends(get_service)
):
    return service.recibir_mercancia(id, cantidad)


@router.get(
    "/inventario/reporte-valor",
    tags=["Gestión de Inventario"],
    summary="Consultar valor total del inventario",
    description="Calcula el valor monetario total del inventario."
)
def reporte_valor(service: MinimercadoService = Depends(get_service)):
    return service.calcular_valor_total()


@router.get(
    "/inventario/alertas",
    tags=["Gestión de Inventario"],
    summary="Consultar alertas de stock bajo",
    description="Devuelve productos cuyo stock es menor o igual al límite definido."
)
def obtener_alertas(
    limite: int = 5,
    service: MinimercadoService = Depends(get_service)
):
    inventario = service.listar_inventario()
    return [p for p in inventario if p["stock"] <= limite]

# --- ÁREA: CLIENTES (Rol: Cliente / Administrador) ---
@router.post(
    "/clientes/registrar",
    tags=["Gestión de Clientes"],
    summary="Registrar nuevo cliente",
    description="Registra un cliente y habilita acumulación de puntos de fidelidad.",
    response_model=Cliente
)
def nuevo_cliente(
    cliente: Cliente,
    service: MinimercadoService = Depends(get_service)
):
    return service.registrar_cliente(cliente)


@router.get(
    "/clientes/lista",
    tags=["Gestión de Clientes"],
    summary="Listar clientes registrados",
    description="Obtiene la lista completa de clientes del sistema."
)
def listar_clientes(service: MinimercadoService = Depends(get_service)):
    return service.repo_cli.get_all()

# --- ÁREA: VENTAS (Rol: Cajero) ---
@router.post(
    "/ventas/facturar",
    tags=["Ventas y Facturación"],
    summary="Registrar venta y generar factura",
    description="Procesa una venta, valida stock, genera factura y acumula puntos.",
    response_model=Venta
)
def crear_factura(
    cliente_id: str,
    carrito: list[ItemCarrito] = Body(
        ...,
        description="Lista de productos con cantidades a comprar"
    ),
    service: MinimercadoService = Depends(get_service)
):
    carrito_dict = [item.dict() for item in carrito]
    return service.procesar_venta_completa(cliente_id, carrito_dict)


@router.get(
    "/ventas/historial",
    tags=["Ventas y Facturación"],
    summary="Consultar historial de ventas",
    description="Devuelve el historial completo de ventas registradas."
)
def historial_ventas(service: MinimercadoService = Depends(get_service)):
    return service.repo_ventas.get_all()
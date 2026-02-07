# Sistema de Gestion de Minimercado

API REST para la gestion de un minimercado con frontend en React. Permite administrar productos, controlar inventario, registrar clientes y procesar ventas con historial.

## Caracteristicas

- Catalogo de productos (listar, crear y eliminar).
- Inventario con alertas de stock bajo y recepcion de mercancia.
- Registro y listado de clientes con puntos de fidelidad.
- Facturacion de ventas y consulta de historial.
- Reportes de ventas e inventario con exportacion a Excel.

## Tecnologias

Backend:
- Python 3.10
- FastAPI
- Pydantic
- Uvicorn
- Pytest + pytest-cov

Frontend:
- React + Vite
- Tailwind CSS
- lucide-react
- xlsx + file-saver

## Estructura del proyecto

```
TFinal_fronetd
├── app
│   ├── controllers
│   ├── models
│   ├── repositories
│   ├── services
│   └── main.py
├── frontend
│   ├── src
│   └── package.json
├── tests
├── requirements.txt
└── README.md
```

## Configuracion del backend

### 1) Crear y activar entorno virtual

Windows (PowerShell):

```bash
python -m venv venv
venv\Scripts\activate
```

Linux/Mac:

```bash
python -m venv venv
source venv/bin/activate
```

### 2) Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3) Ejecutar servidor

```bash
uvicorn app.main:app --reload
```

Abrir:
- Swagger: http://127.0.0.1:8000/docs
- Root: http://127.0.0.1:8000/

## Configuracion del frontend

### 1) Instalar dependencias

```bash
cd frontend
npm install
```

### 2) Configurar URL del backend (opcional)

Por defecto se usa http://127.0.0.1:8000. Para cambiarla, crea `frontend/.env`:

```bash
VITE_API_BASE=http://127.0.0.1:8000
```

### 3) Iniciar frontend

```bash
npm run dev
```

Abrir: http://localhost:5173

## Endpoints del backend

Catalogo:
- GET /catalogo
- POST /catalogo/crear
- DELETE /catalogo/eliminar/{id}

Inventario:
- POST /inventario/recepcion/{id}?cantidad=INT
- GET /inventario/reporte-valor
- GET /inventario/alertas?limite=INT

Clientes:
- POST /clientes/registrar
- GET /clientes/lista

Ventas:
- POST /ventas/facturar?cliente_id=ID
- GET /ventas/historial

## Ejemplos de uso

Crear producto:

```bash
curl -X POST http://127.0.0.1:8000/catalogo/crear \
  -H "Content-Type: application/json" \
  -d '{"id":"P001","nombre":"Arroz","codigoBarras":"123456","precio":2.5,"categoria":"Granos","stock":10}'
```

Registrar cliente:

```bash
curl -X POST http://127.0.0.1:8000/clientes/registrar \
  -H "Content-Type: application/json" \
  -d '{"id":"0102030405","nombre":"Maria Torres","email":"maria@email.com"}'
```

Facturar venta:

```bash
curl -X POST "http://127.0.0.1:8000/ventas/facturar?cliente_id=0102030405" \
  -H "Content-Type: application/json" \
  -d '[{"id":"P001","cantidad":2}]'
```

## Testing

Instalar dependencias adicionales:

```bash
pip install pytest pytest-cov httpx
```

Ejecutar pruebas:

```bash
pytest
```

Cobertura:

```bash
pytest --cov=app --cov-report=term-missing
```

## Datos y persistencia

Los datos se guardan en archivos JSON dentro de la carpeta `data/`:
- productos.json
- clientes.json
- ventas.json

## CORS

El backend permite llamadas desde el frontend Vite:
- http://localhost:5173
- http://127.0.0.1:5173

Si despliegas en otro dominio, ajusta la configuracion en `app/main.py`.

## Solucion de problemas

- ModuleNotFoundError: instala dependencias con `pip install -r requirements.txt`.
- Error 422: revisa que el JSON enviado cumpla el esquema.
- Error 400 por duplicado: usa un ID o codigo de barras unico.
- Error CORS en frontend: verifica que la URL del frontend este incluida en CORS.

## Licencia

Proyecto academico. Uso libre para fines educativos.



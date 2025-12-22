# Sistema de Gestión de Minimercado 

Backend desarrollado en **FastAPI** para la gestión de inventario, ventas, clientes y caja de un minimercado.  
La aplicación expone servicios REST documentados automáticamente mediante **Swagger (OpenAPI 3.0)**.


## Tecnologías utilizadas

- Python 3.12  
- FastAPI  
- Uvicorn  
- Pydantic  
- Swagger UI (OpenAPI)  
- Persistencia de datos en archivos JSON  
- Git y GitHub  


## Estructura del proyecto

app/
├── main.py

├── controllers/

├── services/

├── repositories/

├── models/

data/

├── productos.json

├── clientes.json

├── ventas.json

## Ejecución del proyecto

1. Instalar dependencias:

    pip install fastapi uvicorn

2. Ejecutar la aplicación:

    uvicorn app.main:app --reload

3. Acceder a la API:

    API: http://127.0.0.1:8000

    Swagger UI: http://127.0.0.1:8000/docs

## Documentación con Swagger

FastAPI genera automáticamente la documentación interactiva mediante Swagger UI, permitiendo:

- Visualizar todos los endpoints disponibles

- Probar los servicios REST directamente desde el navegador

- Validar los datos de entrada y salida

- Revisar ejemplos de solicitudes y respuestas

La documentación está disponible en la ruta /docs.

## Funcionalidades principales

- Gestión de productos e inventario

- Registro y consulta de clientes

- Control de stock y alertas de inventario

- Registro de ventas y facturación

- Reportes básicos de inventario y ventas

## Trabajo colaborativo

El proyecto se desarrolla de forma colaborativa utilizando GitHub, donde cada integrante aporta mediante commits y actualizaciones de la aplicación individuales, permitiendo evidenciar el trabajo en equipo y el control de versiones.
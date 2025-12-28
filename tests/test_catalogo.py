def test_crear_producto_exitoso(client):
    # CORRECCIÓN ERROR 422:
    # Se ajustan los datos enviados al endpoint para que coincidan
    # exactamente con el esquema Pydantic definido en schemas.py.
    # Esto evita errores de validación (422 Unprocessable Entity).

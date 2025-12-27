def test_recepcion_mercancia(client):
    """ Test de la recepción de mercancía en el inventario. """

    client.post(
        "/catalogo/crear",
        json={
            "id": "P100",
            "nombre": "Aceite",
            "codigoBarras": "555555",
            "precio": 3.0,
            "categoria": "Abarrotes",
            "stock": 5
        }
    )

    response = client.post("/inventario/recepcion/P100?cantidad=5")
    assert response.status_code == 200

def test_reporte_valor(client):
    """ Test del reporte del valor total del inventario. """
    
    response = client.get("/inventario/reporte-valor")

    assert response.status_code == 200

    data = response.json()
    assert "valor_total_inventario" in data
    assert "items" in data
    assert isinstance(data["valor_total_inventario"], (int, float))
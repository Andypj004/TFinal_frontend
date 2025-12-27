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


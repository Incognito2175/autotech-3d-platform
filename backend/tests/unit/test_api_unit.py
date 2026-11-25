"""
Pruebas unitarias de los endpoints de la API REST.
"""


def test_api_categorias(client):
    """Verifica que /api/categorias retorne las categorías sembradas en JSON."""
    response = client.get("/api/categorias")
    assert response.status_code == 200
    assert response.is_json
    data = response.get_json()
    assert len(data) == 5


def test_api_piezas_y_busqueda(client):
    """Verifica el listado, filtro por búsqueda y detalle con relaciones de piezas."""
    response = client.get("/api/piezas")
    assert response.status_code == 200
    piezas = response.get_json()
    assert len(piezas) == 15

    # Búsqueda por texto
    res_search = client.get("/api/piezas?q=Alternador")
    assert res_search.status_code == 200
    assert len(res_search.get_json()) == 1

    # Detalle incluye relaciones por defecto
    pieza_id = piezas[0]["id"]
    res_detalle = client.get(f"/api/piezas/{pieza_id}")
    assert res_detalle.status_code == 200
    assert "relaciones" in res_detalle.get_json()


def test_api_crud_pieza(client):
    """Verifica creación, actualización y eliminación de una pieza."""
    cats = client.get("/api/categorias").get_json()
    cat_id = cats[0]["id"]

    # Crear
    res_post = client.post(
        "/api/piezas",
        json={
            "nombre": "Sensor MAF",
            "descripcion": "Sensor de flujo de masa de aire",
            "funcion": "Mide el aire que ingresa al motor",
            "categoria_id": cat_id,
        },
    )
    assert res_post.status_code == 201
    pieza_id = res_post.get_json()["id"]

    # Actualizar
    res_put = client.put(
        f"/api/piezas/{pieza_id}",
        json={"nombre": "Sensor MAF Digital"},
    )
    assert res_put.status_code == 200
    assert res_put.get_json()["nombre"] == "Sensor MAF Digital"

    # Eliminar
    res_del = client.delete(f"/api/piezas/{pieza_id}")
    assert res_del.status_code == 200


def test_api_guias_y_pasos(client):
    """Verifica que /api/guias y /api/guias/<id> incluyan pasos ordenados."""
    res_list = client.get("/api/guias")
    assert res_list.status_code == 200
    guias = res_list.get_json()
    assert len(guias) >= 3

    res_det = client.get(f"/api/guias/{guias[0]['id']}")
    assert res_det.status_code == 200
    guia = res_det.get_json()
    assert "pasos" in guia
    assert len(guia["pasos"]) > 0

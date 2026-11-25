"""
Rutas de la API REST — Autotech 3D Backend.

Todos los endpoints devuelven JSON puro. No hay templates HTML.
El prefijo /api agrupa todos los endpoints.
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import text

from app.models import (
    Categoria,
    GuiaReparacion,
    Pieza,
    RelacionAcople,
    db,
)

api = Blueprint("api", __name__, url_prefix="/api")


# =============================================================================
# Health check — lo primero que debes probar en Postman
# =============================================================================

@api.route("/health")
def health():
    """
    Verificación de salud de la aplicación.

    GET /api/health

    Respuesta exitosa (200):
        {
            "status": "ok",
            "app": "Autotech 3D API",
            "version": "1.0.0",
            "message": "Conexión establecida correctamente con la aplicación"
        }
    """
    db.session.execute(text("SELECT 1"))
    return jsonify({
        "status": "ok",
        "app": "Autotech 3D API",
        "version": "1.0.0",
        "message": "Conexión establecida correctamente con la aplicación",
    }), 200


# =============================================================================
# Categorías
# =============================================================================

@api.route("/categorias", methods=["GET"])
def listar_categorias():
    """
    Listar todas las categorías de piezas.

    GET /api/categorias

    Respuesta (200):
        [ { "id": 1, "nombre": "Motor", ... }, ... ]
    """
    categorias = Categoria.query.order_by(Categoria.nombre).all()
    return jsonify([cat.to_dict() for cat in categorias]), 200


@api.route("/categorias/<int:id>", methods=["GET"])
def obtener_categoria(id):
    """
    Obtener una categoría por ID.

    GET /api/categorias/:id

    Respuesta (200): { "id": 1, "nombre": "Motor", ... }
    Respuesta (404): { "error": "Categoría no encontrada" }
    """
    categoria = Categoria.query.get_or_404(id)
    return jsonify(categoria.to_dict()), 200


@api.route("/categorias", methods=["POST"])
def crear_categoria():
    """
    Crear una nueva categoría.

    POST /api/categorias
    Body JSON:
        {
            "nombre": "Motor",
            "descripcion": "Componentes del motor",
            "icono": "fa-cog"
        }

    Respuesta (201): categoría creada
    Respuesta (400): { "error": "El campo 'nombre' es obligatorio" }
    """
    data = request.get_json(silent=True)
    if not data or not data.get("nombre"):
        return jsonify({"error": "El campo 'nombre' es obligatorio"}), 400

    if Categoria.query.filter_by(nombre=data["nombre"]).first():
        return jsonify({"error": "Ya existe una categoría con ese nombre"}), 409

    categoria = Categoria(
        nombre=data["nombre"],
        descripcion=data.get("descripcion"),
        icono=data.get("icono"),
    )
    db.session.add(categoria)
    db.session.commit()
    return jsonify(categoria.to_dict()), 201


# =============================================================================
# Piezas
# =============================================================================

@api.route("/piezas", methods=["GET"])
def listar_piezas():
    """
    Listar todas las piezas, con filtro opcional por categoría.

    GET /api/piezas
    GET /api/piezas?categoria_id=1

    Respuesta (200): lista de piezas
    """
    query = Pieza.query
    categoria_id = request.args.get("categoria_id", type=int)
    if categoria_id is not None:
        query = query.filter_by(categoria_id=categoria_id)
    piezas = query.order_by(Pieza.nombre).all()
    return jsonify([p.to_dict() for p in piezas]), 200


@api.route("/piezas/<int:id>", methods=["GET"])
def obtener_pieza(id):
    """
    Obtener detalle de una pieza con sus relaciones de acople.

    GET /api/piezas/:id?incluir_relaciones=true

    Respuesta (200): pieza con/sin relaciones
    """
    pieza = Pieza.query.get_or_404(id)
    incluir = request.args.get("incluir_relaciones", "false").lower() == "true"
    return jsonify(pieza.to_dict(incluir_relaciones=incluir)), 200


@api.route("/piezas", methods=["POST"])
def crear_pieza():
    """
    Crear una nueva pieza automotriz.

    POST /api/piezas
    Body JSON:
        {
            "nombre": "Pistón",
            "descripcion": "Componente del motor",
            "funcion": "Transmite la fuerza de combustión",
            "categoria_id": 1,
            "imagen_url": "https://...",
            "modelo_3d_url": "https://..."
        }

    Respuesta (201): pieza creada
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Body JSON requerido"}), 400
    if not data.get("nombre"):
        return jsonify({"error": "El campo 'nombre' es obligatorio"}), 400
    if not data.get("categoria_id"):
        return jsonify({"error": "El campo 'categoria_id' es obligatorio"}), 400

    if not Categoria.query.get(data["categoria_id"]):
        return jsonify({"error": "La categoría especificada no existe"}), 404

    pieza = Pieza(
        nombre=data["nombre"],
        descripcion=data.get("descripcion"),
        funcion=data.get("funcion"),
        categoria_id=data["categoria_id"],
        imagen_url=data.get("imagen_url"),
        modelo_3d_url=data.get("modelo_3d_url"),
    )
    db.session.add(pieza)
    db.session.commit()
    return jsonify(pieza.to_dict()), 201


@api.route("/piezas/<int:id>", methods=["PUT"])
def actualizar_pieza(id):
    """
    Actualizar una pieza existente.

    PUT /api/piezas/:id
    Body JSON: campos a actualizar (parcial permitido)
    """
    pieza = Pieza.query.get_or_404(id)
    data = request.get_json(silent=True) or {}

    for campo in ["nombre", "descripcion", "funcion", "imagen_url", "modelo_3d_url"]:
        if campo in data:
            setattr(pieza, campo, data[campo])

    if "categoria_id" in data:
        if not Categoria.query.get(data["categoria_id"]):
            return jsonify({"error": "La categoría especificada no existe"}), 404
        pieza.categoria_id = data["categoria_id"]

    db.session.commit()
    return jsonify(pieza.to_dict()), 200


@api.route("/piezas/<int:id>", methods=["DELETE"])
def eliminar_pieza(id):
    """
    Eliminar una pieza automotriz.

    DELETE /api/piezas/:id

    Respuesta (200): { "message": "Pieza eliminada correctamente" }
    """
    pieza = Pieza.query.get_or_404(id)
    db.session.delete(pieza)
    db.session.commit()
    return jsonify({"message": "Pieza eliminada correctamente"}), 200


# =============================================================================
# Guías de Reparación
# =============================================================================

@api.route("/guias", methods=["GET"])
def listar_guias():
    """
    Listar todas las guías de reparación, con filtro opcional por pieza.

    GET /api/guias
    GET /api/guias?pieza_id=2
    """
    query = GuiaReparacion.query
    pieza_id = request.args.get("pieza_id", type=int)
    if pieza_id is not None:
        query = query.filter_by(pieza_id=pieza_id)
    guias = query.order_by(GuiaReparacion.created_at.desc()).all()
    return jsonify([g.to_dict() for g in guias]), 200


@api.route("/guias/<int:id>", methods=["GET"])
def obtener_guia(id):
    """
    Obtener una guía de reparación con todos sus pasos.

    GET /api/guias/:id
    GET /api/guias/:id?incluir_pasos=true
    """
    guia = GuiaReparacion.query.get_or_404(id)
    incluir = request.args.get("incluir_pasos", "true").lower() == "true"
    return jsonify(guia.to_dict(incluir_pasos=incluir)), 200


@api.route("/guias", methods=["POST"])
def crear_guia():
    """
    Crear una nueva guía de reparación.

    POST /api/guias
    Body JSON:
        {
            "titulo": "Cambio de bujías",
            "descripcion": "Guía completa para...",
            "dificultad": "facil",
            "tiempo_estimado": "30 minutos",
            "pieza_id": 3
        }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Body JSON requerido"}), 400
    for campo_req in ["titulo", "pieza_id"]:
        if not data.get(campo_req):
            return jsonify({"error": f"El campo '{campo_req}' es obligatorio"}), 400

    dificultad = data.get("dificultad", "medio")
    if dificultad not in ["facil", "medio", "dificil"]:
        return jsonify({"error": "Dificultad debe ser: facil, medio o dificil"}), 400

    guia = GuiaReparacion(
        titulo=data["titulo"],
        descripcion=data.get("descripcion"),
        dificultad=dificultad,
        tiempo_estimado=data.get("tiempo_estimado"),
        pieza_id=data["pieza_id"],
    )
    db.session.add(guia)
    db.session.commit()
    return jsonify(guia.to_dict()), 201


# =============================================================================
# Relaciones de Acople
# =============================================================================

@api.route("/relaciones/<int:pieza_id>", methods=["GET"])
def obtener_relaciones(pieza_id):
    """
    Obtener todas las relaciones de ensamblaje de una pieza.

    GET /api/relaciones/:pieza_id
    """
    Pieza.query.get_or_404(pieza_id)
    relaciones = RelacionAcople.query.filter(
        (RelacionAcople.pieza_origen_id == pieza_id)
        | (RelacionAcople.pieza_destino_id == pieza_id)
    ).all()
    return jsonify([rel.to_dict() for rel in relaciones]), 200


@api.route("/relaciones", methods=["POST"])
def crear_relacion():
    """
    Crear una relación de acople entre dos piezas.

    POST /api/relaciones
    Body JSON:
        {
            "pieza_origen_id": 1,
            "pieza_destino_id": 2,
            "tipo_relacion": "conecta_con",
            "descripcion": "El pistón se conecta con la biela"
        }

    Tipos válidos: conecta_con, se_ensambla_en, requiere
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Body JSON requerido"}), 400

    tipos_validos = ["conecta_con", "se_ensambla_en", "requiere"]
    if data.get("tipo_relacion") not in tipos_validos:
        return jsonify({"error": f"tipo_relacion debe ser uno de: {tipos_validos}"}), 400

    relacion = RelacionAcople(
        pieza_origen_id=data["pieza_origen_id"],
        pieza_destino_id=data["pieza_destino_id"],
        tipo_relacion=data["tipo_relacion"],
        descripcion=data.get("descripcion"),
    )
    db.session.add(relacion)
    db.session.commit()
    return jsonify(relacion.to_dict()), 201

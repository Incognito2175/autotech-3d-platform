"""
Rutas de la API REST — Autotech 3D Backend.

Todos los endpoints devuelven JSON puro.
El prefijo /api agrupa todos los endpoints de la API.
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import or_, text

from app.models import (
    Categoria,
    GuiaReparacion,
    PasoGuia,
    Pieza,
    RelacionAcople,
    db,
)

api = Blueprint("api", __name__, url_prefix="/api")


# =============================================================================
# Health check — verificación de conexión en Postman y Frontend
# =============================================================================

@api.route("/health", methods=["GET"])
def health():
    """
    Verificación de salud de la aplicación y conectividad con MySQL.
    GET /api/health
    """
    db.session.execute(text("SELECT 1"))
    return jsonify({
        "status": "ok",
        "app": "Autotech 3D API",
        "version": "1.0.0",
        "database": "connected",
        "message": "Conexión establecida correctamente con la aplicación",
    }), 200


# =============================================================================
# Categorías
# =============================================================================

@api.route("/categorias", methods=["GET"])
def listar_categorias():
    """Listar todas las categorías de piezas ordenadas por nombre."""
    categorias = Categoria.query.order_by(Categoria.nombre).all()
    return jsonify([cat.to_dict() for cat in categorias]), 200


@api.route("/categorias/<int:id>", methods=["GET"])
def obtener_categoria(id):
    """Obtener una categoría por ID."""
    categoria = db.get_or_404(Categoria, id)
    return jsonify(categoria.to_dict()), 200


@api.route("/categorias", methods=["POST"])
def crear_categoria():
    """Crear una nueva categoría."""
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


@api.route("/categorias/<int:id>", methods=["PUT"])
def actualizar_categoria(id):
    """Actualizar una categoría existente."""
    categoria = db.get_or_404(Categoria, id)
    data = request.get_json(silent=True) or {}

    for campo in ["nombre", "descripcion", "icono"]:
        if campo in data:
            setattr(categoria, campo, data[campo])

    db.session.commit()
    return jsonify(categoria.to_dict()), 200


@api.route("/categorias/<int:id>", methods=["DELETE"])
def eliminar_categoria(id):
    """Eliminar una categoría."""
    categoria = db.get_or_404(Categoria, id)
    db.session.delete(categoria)
    db.session.commit()
    return jsonify({"message": "Categoría eliminada correctamente"}), 200


# =============================================================================
# Piezas
# =============================================================================

@api.route("/piezas", methods=["GET"])
def listar_piezas():
    """
    Listar todas las piezas, con filtro opcional por categoría o búsqueda (?q=).
    GET /api/piezas
    GET /api/piezas?categoria_id=1
    GET /api/piezas?q=piston
    """
    query = Pieza.query

    categoria_id = request.args.get("categoria_id", type=int)
    if categoria_id is not None:
        query = query.filter_by(categoria_id=categoria_id)

    termino = request.args.get("q", type=str)
    if termino:
        patron = f"%{termino.strip()}%"
        query = query.filter(
            or_(
                Pieza.nombre.ilike(patron),
                Pieza.descripcion.ilike(patron),
                Pieza.funcion.ilike(patron),
            )
        )

    piezas = query.order_by(Pieza.nombre).all()
    return jsonify([p.to_dict() for p in piezas]), 200


@api.route("/piezas/<int:id>", methods=["GET"])
def obtener_pieza(id):
    """
    Obtener detalle de una pieza con sus relaciones de acople.
    GET /api/piezas/:id
    """
    pieza = db.get_or_404(Pieza, id)
    incluir_param = request.args.get("incluir_relaciones")
    incluir = (
        True if incluir_param is None else incluir_param.lower() == "true"
    )
    return jsonify(pieza.to_dict(incluir_relaciones=incluir)), 200


@api.route("/piezas", methods=["POST"])
def crear_pieza():
    """Crear una nueva pieza automotriz."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Body JSON requerido"}), 400
    if not data.get("nombre"):
        return jsonify({"error": "El campo 'nombre' es obligatorio"}), 400
    if not data.get("categoria_id"):
        return jsonify({"error": "El campo 'categoria_id' es obligatorio"}), 400

    if not db.session.get(Categoria, data["categoria_id"]):
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
    """Actualizar una pieza existente."""
    pieza = db.get_or_404(Pieza, id)
    data = request.get_json(silent=True) or {}

    for campo in ["nombre", "descripcion", "funcion", "imagen_url", "modelo_3d_url"]:
        if campo in data:
            setattr(pieza, campo, data[campo])

    if "categoria_id" in data:
        if not db.session.get(Categoria, data["categoria_id"]):
            return jsonify({"error": "La categoría especificada no existe"}), 404
        pieza.categoria_id = data["categoria_id"]

    db.session.commit()
    return jsonify(pieza.to_dict()), 200


@api.route("/piezas/<int:id>", methods=["DELETE"])
def eliminar_pieza(id):
    """Eliminar una pieza automotriz."""
    pieza = db.get_or_404(Pieza, id)
    db.session.delete(pieza)
    db.session.commit()
    return jsonify({"message": "Pieza eliminada correctamente"}), 200


# =============================================================================
# Guías de Reparación
# =============================================================================

@api.route("/guias", methods=["GET"])
def listar_guias():
    """
    Listar todas las guías de reparación, con filtros opcionales por pieza o dificultad.
    GET /api/guias
    GET /api/guias?pieza_id=2
    GET /api/guias?dificultad=medio
    """
    query = GuiaReparacion.query
    pieza_id = request.args.get("pieza_id", type=int)
    if pieza_id is not None:
        query = query.filter_by(pieza_id=pieza_id)

    dificultad = request.args.get("dificultad", type=str)
    if dificultad:
        query = query.filter_by(dificultad=dificultad.lower())

    guias = query.order_by(GuiaReparacion.created_at.desc()).all()
    return jsonify([g.to_dict() for g in guias]), 200


@api.route("/guias/<int:id>", methods=["GET"])
def obtener_guia(id):
    """Obtener una guía de reparación con todos sus pasos."""
    guia = db.get_or_404(GuiaReparacion, id)
    incluir = request.args.get("incluir_pasos", "true").lower() == "true"
    return jsonify(guia.to_dict(incluir_pasos=incluir)), 200


@api.route("/guias", methods=["POST"])
def crear_guia():
    """Crear una nueva guía de reparación (opcionalmente con pasos)."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Body JSON requerido"}), 400
    for campo_req in ["titulo", "pieza_id"]:
        if not data.get(campo_req):
            return jsonify({"error": f"El campo '{campo_req}' es obligatorio"}), 400

    if not db.session.get(Pieza, data["pieza_id"]):
        return jsonify({"error": "La pieza especificada no existe"}), 404

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
    db.session.flush()

    pasos = data.get("pasos") or []
    for idx, paso_data in enumerate(pasos, start=1):
        paso = PasoGuia(
            guia_id=guia.id,
            numero_paso=paso_data.get("numero_paso", idx),
            titulo=paso_data.get("titulo", f"Paso {idx}"),
            instruccion=paso_data.get("instruccion", ""),
            imagen_url=paso_data.get("imagen_url"),
            advertencia=paso_data.get("advertencia"),
        )
        db.session.add(paso)

    db.session.commit()
    return jsonify(guia.to_dict(incluir_pasos=bool(pasos))), 201


@api.route("/guias/<int:id>", methods=["DELETE"])
def eliminar_guia(id):
    """Eliminar una guía de reparación y sus pasos."""
    guia = db.get_or_404(GuiaReparacion, id)
    PasoGuia.query.filter_by(guia_id=guia.id).delete()
    db.session.delete(guia)
    db.session.commit()
    return jsonify({"message": "Guía eliminada correctamente"}), 200


# =============================================================================
# Relaciones de Acople
# =============================================================================

@api.route("/relaciones/<int:pieza_id>", methods=["GET"])
def obtener_relaciones(pieza_id):
    """Obtener todas las relaciones de ensamblaje de una pieza."""
    db.get_or_404(Pieza, pieza_id)
    relaciones = RelacionAcople.query.filter(
        (RelacionAcople.pieza_origen_id == pieza_id)
        | (RelacionAcople.pieza_destino_id == pieza_id)
    ).all()
    return jsonify([rel.to_dict() for rel in relaciones]), 200


@api.route("/relaciones", methods=["POST"])
def crear_relacion():
    """Crear una relación de acople entre dos piezas."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Body JSON requerido"}), 400

    tipos_validos = ["conecta_con", "se_ensambla_en", "requiere"]
    if data.get("tipo_relacion") not in tipos_validos:
        return jsonify({"error": f"tipo_relacion debe ser uno de: {tipos_validos}"}), 400

    if not data.get("pieza_origen_id") or not data.get("pieza_destino_id"):
        return jsonify({"error": "pieza_origen_id y pieza_destino_id son obligatorios"}), 400

    relacion = RelacionAcople(
        pieza_origen_id=data["pieza_origen_id"],
        pieza_destino_id=data["pieza_destino_id"],
        tipo_relacion=data["tipo_relacion"],
        descripcion=data.get("descripcion"),
    )
    db.session.add(relacion)
    db.session.commit()
    return jsonify(relacion.to_dict()), 201


@api.route("/relaciones/<int:id>", methods=["DELETE"])
def eliminar_relacion(id):
    """Eliminar una relación de acople."""
    relacion = db.get_or_404(RelacionAcople, id)
    db.session.delete(relacion)
    db.session.commit()
    return jsonify({"message": "Relación eliminada correctamente"}), 200

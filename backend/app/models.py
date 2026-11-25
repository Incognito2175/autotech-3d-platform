"""
Modelos de base de datos para la plataforma Autotech 3D.

Define las entidades principales del dominio automotriz:
categorías, piezas, guías de reparación, pasos y relaciones de acople.
"""

from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

# Instancia global de SQLAlchemy, inicializada en la fábrica de la aplicación
db = SQLAlchemy()


class Categoria(db.Model):
    """Modelo que representa una categoría de piezas automotrices."""

    __tablename__ = "categorias"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text, nullable=True)
    icono = db.Column(db.String(50), nullable=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    piezas = db.relationship("Pieza", backref="categoria", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "icono": self.icono,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }

    def __repr__(self):
        return f"<Categoria {self.nombre}>"


class Pieza(db.Model):
    """Modelo que representa una pieza o componente automotriz."""

    __tablename__ = "piezas"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(150), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    funcion = db.Column(db.Text, nullable=True)
    categoria_id = db.Column(
        db.Integer, db.ForeignKey("categorias.id"), nullable=False
    )
    imagen_url = db.Column(db.String(500), nullable=True)
    modelo_3d_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    guias = db.relationship("GuiaReparacion", backref="pieza", lazy="dynamic")
    relaciones_origen = db.relationship(
        "RelacionAcople",
        foreign_keys="RelacionAcople.pieza_origen_id",
        backref="pieza_origen",
        lazy="dynamic",
    )
    relaciones_destino = db.relationship(
        "RelacionAcople",
        foreign_keys="RelacionAcople.pieza_destino_id",
        backref="pieza_destino",
        lazy="dynamic",
    )

    def to_dict(self, incluir_relaciones=False):
        datos = {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "funcion": self.funcion,
            "categoria_id": self.categoria_id,
            "categoria_nombre": (
                self.categoria.nombre if self.categoria else None
            ),
            "imagen_url": self.imagen_url,
            "modelo_3d_url": self.modelo_3d_url,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }
        if incluir_relaciones:
            datos["relaciones"] = [
                r.to_dict() for r in self.relaciones_origen.all()
            ] + [r.to_dict() for r in self.relaciones_destino.all()]
        return datos

    def __repr__(self):
        return f"<Pieza {self.nombre}>"


class GuiaReparacion(db.Model):
    """Modelo que representa una guía de reparación paso a paso."""

    __tablename__ = "guias_reparacion"

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    dificultad = db.Column(db.String(20), nullable=False, default="medio")
    tiempo_estimado = db.Column(db.String(50), nullable=True)
    pieza_id = db.Column(
        db.Integer, db.ForeignKey("piezas.id"), nullable=False
    )
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    pasos = db.relationship(
        "PasoGuia",
        backref="guia",
        lazy="dynamic",
        order_by="PasoGuia.numero_paso",
    )

    def to_dict(self, incluir_pasos=False):
        datos = {
            "id": self.id,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "dificultad": self.dificultad,
            "tiempo_estimado": self.tiempo_estimado,
            "pieza_id": self.pieza_id,
            "pieza_nombre": self.pieza.nombre if self.pieza else None,
            "created_at": (
                self.created_at.isoformat() if self.created_at else None
            ),
        }
        if incluir_pasos:
            datos["pasos"] = [p.to_dict() for p in self.pasos.all()]
        return datos

    def __repr__(self):
        return f"<GuiaReparacion {self.titulo}>"


class PasoGuia(db.Model):
    """Modelo que representa un paso individual dentro de una guía."""

    __tablename__ = "pasos_guia"

    id = db.Column(db.Integer, primary_key=True)
    guia_id = db.Column(
        db.Integer, db.ForeignKey("guias_reparacion.id"), nullable=False
    )
    numero_paso = db.Column(db.Integer, nullable=False)
    titulo = db.Column(db.String(200), nullable=False)
    instruccion = db.Column(db.Text, nullable=False)
    imagen_url = db.Column(db.String(500), nullable=True)
    advertencia = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "guia_id": self.guia_id,
            "numero_paso": self.numero_paso,
            "titulo": self.titulo,
            "instruccion": self.instruccion,
            "imagen_url": self.imagen_url,
            "advertencia": self.advertencia,
        }

    def __repr__(self):
        return f"<PasoGuia {self.guia_id}:Paso {self.numero_paso}>"


class RelacionAcople(db.Model):
    """Modelo que define relaciones de ensamblaje entre piezas."""

    __tablename__ = "relaciones_acople"

    id = db.Column(db.Integer, primary_key=True)
    pieza_origen_id = db.Column(
        db.Integer, db.ForeignKey("piezas.id"), nullable=False
    )
    pieza_destino_id = db.Column(
        db.Integer, db.ForeignKey("piezas.id"), nullable=False
    )
    tipo_relacion = db.Column(db.String(30), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "pieza_origen_id": self.pieza_origen_id,
            "pieza_origen_nombre": (
                self.pieza_origen.nombre if self.pieza_origen else None
            ),
            "pieza_destino_id": self.pieza_destino_id,
            "pieza_destino_nombre": (
                self.pieza_destino.nombre if self.pieza_destino else None
            ),
            "tipo_relacion": self.tipo_relacion,
            "descripcion": self.descripcion,
        }

    def __repr__(self):
        return f"<RelacionAcople {self.pieza_origen_id} -> {self.pieza_destino_id}>"

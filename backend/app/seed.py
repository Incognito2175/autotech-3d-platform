"""
Módulo de datos semilla para la plataforma Autotech 3D.

Proporciona la función seed_database() que puebla la base de datos
con datos realistas del dominio automotriz para desarrollo y demostración.
"""

from app.models import (
    Categoria,
    GuiaReparacion,
    PasoGuia,
    Pieza,
    RelacionAcople,
    db,
)


def seed_database():
    """
    Puebla la base de datos con datos realistas de mecánica automotriz.

    Incluye 5 categorías, 15+ piezas, 3+ guías con pasos detallados
    y 10+ relaciones de ensamblaje entre piezas.
    Solo inserta datos si la tabla de categorías está vacía.
    """
    # Verificar si ya existen datos para evitar duplicados
    if Categoria.query.first() is not None:
        print("La base de datos ya contiene datos. Omitiendo seed.")
        return

    # =========================================================================
    # Categorías principales del dominio automotriz
    # =========================================================================
    categorias_data = [
        {
            "nombre": "Motor",
            "descripcion": (
                "Componentes del motor de combustión interna, incluyendo "
                "el bloque, culata, sistema de distribución y lubricación."
            ),
            "icono": "fa-engine",
        },
        {
            "nombre": "Sistema Eléctrico",
            "descripcion": (
                "Componentes eléctricos y electrónicos del vehículo: "
                "alternador, batería, sistema de encendido y sensores."
            ),
            "icono": "fa-bolt",
        },
        {
            "nombre": "Frenos",
            "descripcion": (
                "Sistema de frenado del vehículo: discos, pastillas, "
                "cilindros, calipers y sistema ABS."
            ),
            "icono": "fa-circle-stop",
        },
        {
            "nombre": "Suspensión",
            "descripcion": (
                "Sistema de suspensión y dirección: amortiguadores, "
                "resortes, barras estabilizadoras y rótulas."
            ),
            "icono": "fa-road",
        },
        {
            "nombre": "Transmisión",
            "descripcion": (
                "Sistema de transmisión de potencia: caja de cambios, "
                "embrague, ejes, juntas homocinéticas y diferencial."
            ),
            "icono": "fa-gears",
        },
    ]

    categorias = {}
    for cat_data in categorias_data:
        categoria = Categoria(**cat_data)
        db.session.add(categoria)
        db.session.flush()  # Obtener el ID asignado
        categorias[cat_data["nombre"]] = categoria

    # =========================================================================
    # Piezas automotrices distribuidas en las categorías
    # =========================================================================
    piezas_data = [
        # --- Motor (4 piezas) ---
        {
            "nombre": "Pistón",
            "descripcion": (
                "Componente cilíndrico que se desplaza dentro del cilindro "
                "del motor, transmitiendo la fuerza de los gases de combustión "
                "al cigüeñal a través de la biela."
            ),
            "funcion": (
                "Convertir la presión de los gases de combustión en "
                "movimiento lineal alternativo."
            ),
            "categoria": "Motor",
            "imagen_url": "/static/img/piezas/piston.png",
            "modelo_3d_url": "/static/models/piston.glb",
        },
        {
            "nombre": "Cigüeñal",
            "descripcion": (
                "Eje principal del motor con manivelas que convierten el "
                "movimiento lineal de los pistones en movimiento rotativo "
                "para impulsar el vehículo."
            ),
            "funcion": (
                "Transformar el movimiento alternativo de los pistones "
                "en movimiento rotatorio continuo."
            ),
            "categoria": "Motor",
            "imagen_url": "/static/img/piezas/ciguenal.png",
            "modelo_3d_url": "/static/models/ciguenal.glb",
        },
        {
            "nombre": "Árbol de Levas",
            "descripcion": (
                "Eje con lóbulos excéntricos que controla la apertura y "
                "cierre de las válvulas de admisión y escape del motor "
                "sincronizado con el cigüeñal."
            ),
            "funcion": (
                "Controlar la temporización de las válvulas de admisión "
                "y escape del motor."
            ),
            "categoria": "Motor",
            "imagen_url": "/static/img/piezas/arbol_levas.png",
            "modelo_3d_url": "/static/models/arbol_levas.glb",
        },
        {
            "nombre": "Correa de Distribución",
            "descripcion": (
                "Banda dentada de caucho reforzado que sincroniza el "
                "movimiento del cigüeñal con el árbol de levas, "
                "asegurando la correcta apertura de válvulas."
            ),
            "funcion": (
                "Sincronizar la rotación del cigüeñal con el árbol "
                "de levas para mantener la distribución del motor."
            ),
            "categoria": "Motor",
            "imagen_url": "/static/img/piezas/correa_distribucion.png",
            "modelo_3d_url": "/static/models/correa_distribucion.glb",
        },
        # --- Sistema Eléctrico (3 piezas) ---
        {
            "nombre": "Alternador",
            "descripcion": (
                "Generador eléctrico accionado por el motor que produce "
                "corriente alterna, la rectifica y alimenta el sistema "
                "eléctrico del vehículo mientras recarga la batería."
            ),
            "funcion": (
                "Generar energía eléctrica para alimentar los sistemas "
                "del vehículo y recargar la batería."
            ),
            "categoria": "Sistema Eléctrico",
            "imagen_url": "/static/img/piezas/alternador.png",
            "modelo_3d_url": "/static/models/alternador.glb",
        },
        {
            "nombre": "Bujía de Encendido",
            "descripcion": (
                "Dispositivo que genera la chispa eléctrica necesaria para "
                "inflamar la mezcla aire-combustible dentro de la cámara "
                "de combustión del motor."
            ),
            "funcion": (
                "Producir la chispa de alta tensión que inicia la "
                "combustión en el cilindro del motor."
            ),
            "categoria": "Sistema Eléctrico",
            "imagen_url": "/static/img/piezas/bujia.png",
            "modelo_3d_url": "/static/models/bujia.glb",
        },
        {
            "nombre": "Batería",
            "descripcion": (
                "Acumulador de energía eléctrica de 12V que almacena "
                "la carga necesaria para el arranque del motor y alimenta "
                "los sistemas eléctricos cuando el motor está apagado."
            ),
            "funcion": (
                "Almacenar y suministrar energía eléctrica para el "
                "arranque y los sistemas auxiliares del vehículo."
            ),
            "categoria": "Sistema Eléctrico",
            "imagen_url": "/static/img/piezas/bateria.png",
            "modelo_3d_url": "/static/models/bateria.glb",
        },
        # --- Frenos (3 piezas) ---
        {
            "nombre": "Disco de Freno",
            "descripcion": (
                "Disco metálico ventilado montado en el buje de la rueda "
                "que gira solidariamente con ella. Las pastillas presionan "
                "contra él para generar la fuerza de frenado por fricción."
            ),
            "funcion": (
                "Proporcionar la superficie de fricción donde las "
                "pastillas actúan para detener la rueda."
            ),
            "categoria": "Frenos",
            "imagen_url": "/static/img/piezas/disco_freno.png",
            "modelo_3d_url": "/static/models/disco_freno.glb",
        },
        {
            "nombre": "Pastilla de Freno",
            "descripcion": (
                "Elemento de fricción compuesto por un soporte metálico "
                "y un material de alta resistencia térmica que se presiona "
                "contra el disco de freno para detener el vehículo."
            ),
            "funcion": (
                "Generar la fricción necesaria contra el disco de freno "
                "para reducir la velocidad del vehículo."
            ),
            "categoria": "Frenos",
            "imagen_url": "/static/img/piezas/pastilla_freno.png",
            "modelo_3d_url": "/static/models/pastilla_freno.glb",
        },
        {
            "nombre": "Caliper de Freno",
            "descripcion": (
                "Mordaza hidráulica que aloja las pastillas de freno y, "
                "al recibir presión del líquido de frenos, las empuja "
                "contra el disco para generar el frenado."
            ),
            "funcion": (
                "Alojar las pastillas y aplicar la presión hidráulica "
                "necesaria para comprimir las pastillas contra el disco."
            ),
            "categoria": "Frenos",
            "imagen_url": "/static/img/piezas/caliper.png",
            "modelo_3d_url": "/static/models/caliper.glb",
        },
        # --- Suspensión (3 piezas) ---
        {
            "nombre": "Amortiguador",
            "descripcion": (
                "Dispositivo hidráulico o de gas que absorbe y disipa "
                "la energía de las oscilaciones del resorte, controlando "
                "el movimiento de la suspensión y manteniendo el contacto "
                "del neumático con el suelo."
            ),
            "funcion": (
                "Amortiguar las oscilaciones de la suspensión para "
                "mantener estabilidad y confort de marcha."
            ),
            "categoria": "Suspensión",
            "imagen_url": "/static/img/piezas/amortiguador.png",
            "modelo_3d_url": "/static/models/amortiguador.glb",
        },
        {
            "nombre": "Resorte Helicoidal",
            "descripcion": (
                "Muelle de acero en forma de espiral que absorbe los "
                "impactos de las irregularidades del camino y soporta "
                "el peso del vehículo sobre las ruedas."
            ),
            "funcion": (
                "Absorber los impactos del terreno y soportar el peso "
                "del vehículo manteniendo la altura de la carrocería."
            ),
            "categoria": "Suspensión",
            "imagen_url": "/static/img/piezas/resorte.png",
            "modelo_3d_url": "/static/models/resorte.glb",
        },
        {
            "nombre": "Rótula de Suspensión",
            "descripcion": (
                "Articulación esférica que conecta los brazos de control "
                "con la mangueta de la rueda, permitiendo el movimiento "
                "vertical de la suspensión y el giro de la dirección."
            ),
            "funcion": (
                "Permitir la articulación entre los brazos de control "
                "y la mangueta para el movimiento de la suspensión."
            ),
            "categoria": "Suspensión",
            "imagen_url": "/static/img/piezas/rotula.png",
            "modelo_3d_url": "/static/models/rotula.glb",
        },
        # --- Transmisión (2 piezas) ---
        {
            "nombre": "Disco de Embrague",
            "descripcion": (
                "Disco de fricción que se acopla entre el volante del "
                "motor y la caja de cambios, permitiendo transmitir o "
                "interrumpir el par motor de forma suave y progresiva."
            ),
            "funcion": (
                "Transmitir o interrumpir el par motor hacia la caja "
                "de cambios permitiendo los cambios de marcha."
            ),
            "categoria": "Transmisión",
            "imagen_url": "/static/img/piezas/disco_embrague.png",
            "modelo_3d_url": "/static/models/disco_embrague.glb",
        },
        {
            "nombre": "Junta Homocinética",
            "descripcion": (
                "Articulación de velocidad constante que transmite el "
                "par motor desde la caja de cambios a las ruedas, "
                "permitiendo el movimiento de la suspensión y la dirección "
                "sin variaciones en la velocidad de giro."
            ),
            "funcion": (
                "Transmitir el par motor a las ruedas motrices "
                "manteniendo velocidad angular constante en cualquier "
                "ángulo de giro."
            ),
            "categoria": "Transmisión",
            "imagen_url": "/static/img/piezas/junta_homocinetica.png",
            "modelo_3d_url": "/static/models/junta_homocinetica.glb",
        },
    ]

    piezas = {}
    for pieza_data in piezas_data:
        categoria_nombre = pieza_data.pop("categoria")
        pieza = Pieza(
            categoria_id=categorias[categoria_nombre].id,
            **pieza_data,
        )
        db.session.add(pieza)
        db.session.flush()
        piezas[pieza.nombre] = pieza

    # =========================================================================
    # Guías de reparación con pasos detallados
    # =========================================================================
    guias_pasos = [
        {
            "guia": {
                "titulo": "Cambio de Pastillas de Freno Delanteras",
                "descripcion": (
                    "Procedimiento completo para reemplazar las pastillas "
                    "de freno delanteras en un vehículo de turismo. "
                    "Incluye inspección del disco y sangrado del sistema."
                ),
                "dificultad": "medio",
                "tiempo_estimado": "1 hora 30 minutos",
                "pieza": "Pastilla de Freno",
            },
            "pasos": [
                {
                    "numero_paso": 1,
                    "titulo": "Preparación y seguridad",
                    "instruccion": (
                        "Estacione el vehículo en superficie plana y firme. "
                        "Coloque el freno de mano y calzas en las ruedas "
                        "traseras. Afloje los tornillos de la rueda delantera "
                        "antes de elevar el vehículo con el gato hidráulico."
                    ),
                    "imagen_url": "/static/img/guias/frenos_paso1.png",
                    "advertencia": (
                        "Nunca trabaje bajo un vehículo sostenido únicamente "
                        "por el gato. Use siempre caballetes de seguridad."
                    ),
                },
                {
                    "numero_paso": 2,
                    "titulo": "Desmontaje del caliper",
                    "instruccion": (
                        "Retire la rueda. Localice los tornillos guía del "
                        "caliper (generalmente 2 tornillos Allen o Torx). "
                        "Desatornille y retire el caliper con cuidado. "
                        "Sujételo con un alambre al resorte de la suspensión "
                        "sin desconectar la manguera de freno."
                    ),
                    "imagen_url": "/static/img/guias/frenos_paso2.png",
                    "advertencia": (
                        "No deje el caliper colgando de la manguera de freno, "
                        "podría dañarla y causar una pérdida de líquido."
                    ),
                },
                {
                    "numero_paso": 3,
                    "titulo": "Inspección del disco de freno",
                    "instruccion": (
                        "Con el caliper retirado, inspeccione el disco de "
                        "freno. Mida el espesor con un micrómetro y compárelo "
                        "con la especificación mínima del fabricante. Verifique "
                        "que no haya grietas, surcos profundos ni deformaciones."
                    ),
                    "imagen_url": "/static/img/guias/frenos_paso3.png",
                    "advertencia": None,
                },
                {
                    "numero_paso": 4,
                    "titulo": "Instalación de las pastillas nuevas",
                    "instruccion": (
                        "Retire las pastillas usadas. Limpie el soporte del "
                        "caliper con un cepillo metálico. Aplique grasa "
                        "cerámica en las guías. Comprima el pistón del caliper "
                        "con una herramienta adecuada. Instale las pastillas "
                        "nuevas asegurándose de su correcta orientación."
                    ),
                    "imagen_url": "/static/img/guias/frenos_paso4.png",
                    "advertencia": (
                        "Al comprimir el pistón, abra el tapón del depósito "
                        "de líquido de frenos para evitar sobrepresión."
                    ),
                },
                {
                    "numero_paso": 5,
                    "titulo": "Montaje final y verificación",
                    "instruccion": (
                        "Reinstale el caliper y apriete los tornillos guía "
                        "al par especificado. Monte la rueda y apriete los "
                        "tornillos en estrella. Baje el vehículo. Pise el "
                        "pedal de freno varias veces para asentar las pastillas. "
                        "Verifique el nivel de líquido de frenos."
                    ),
                    "imagen_url": "/static/img/guias/frenos_paso5.png",
                    "advertencia": (
                        "Antes de circular, verifique que el pedal de freno "
                        "esté firme. Realice las primeras frenadas suaves "
                        "para asentar las pastillas nuevas."
                    ),
                },
            ],
        },
        {
            "guia": {
                "titulo": "Reemplazo del Alternador",
                "descripcion": (
                    "Guía paso a paso para diagnosticar y reemplazar el "
                    "alternador del vehículo cuando presenta fallas de "
                    "carga o ruidos anormales."
                ),
                "dificultad": "dificil",
                "tiempo_estimado": "2 horas",
                "pieza": "Alternador",
            },
            "pasos": [
                {
                    "numero_paso": 1,
                    "titulo": "Desconexión de la batería",
                    "instruccion": (
                        "Apague el motor y retire la llave. Desconecte "
                        "el terminal negativo (-) de la batería primero, "
                        "luego el positivo (+). Espere 5 minutos antes "
                        "de continuar."
                    ),
                    "imagen_url": "/static/img/guias/alternador_paso1.png",
                    "advertencia": (
                        "Siempre desconecte primero el terminal negativo "
                        "para evitar cortocircuitos. Use guantes aislantes."
                    ),
                },
                {
                    "numero_paso": 2,
                    "titulo": "Retiro de la correa de accesorios",
                    "instruccion": (
                        "Localice el tensor automático de la correa. "
                        "Con una llave o herramienta tensora, alivie la "
                        "tensión y deslice la correa fuera de la polea "
                        "del alternador. Anote el recorrido de la correa "
                        "o tome una foto antes de retirarla."
                    ),
                    "imagen_url": "/static/img/guias/alternador_paso2.png",
                    "advertencia": None,
                },
                {
                    "numero_paso": 3,
                    "titulo": "Desmontaje del alternador",
                    "instruccion": (
                        "Desconecte los cables eléctricos del alternador: "
                        "el conector de señal y el cable principal (tuerca). "
                        "Retire los tornillos de fijación (generalmente 2-3). "
                        "Extraiga el alternador del motor."
                    ),
                    "imagen_url": "/static/img/guias/alternador_paso3.png",
                    "advertencia": (
                        "El alternador puede pesar entre 5 y 8 kg. "
                        "Sujételo con firmeza al retirar el último tornillo."
                    ),
                },
                {
                    "numero_paso": 4,
                    "titulo": "Instalación y prueba",
                    "instruccion": (
                        "Monte el alternador nuevo en posición. Apriete los "
                        "tornillos de fijación al par especificado. Reconecte "
                        "los cables eléctricos. Instale la correa. Reconecte "
                        "la batería (positivo primero, luego negativo). "
                        "Arranque el motor y verifique con un multímetro que "
                        "el voltaje de carga esté entre 13.5V y 14.5V."
                    ),
                    "imagen_url": "/static/img/guias/alternador_paso4.png",
                    "advertencia": (
                        "Si el voltaje de carga no es correcto, verifique "
                        "las conexiones antes de asumir un defecto del "
                        "alternador nuevo."
                    ),
                },
            ],
        },
        {
            "guia": {
                "titulo": "Sustitución de Amortiguadores Delanteros",
                "descripcion": (
                    "Procedimiento para reemplazar los amortiguadores "
                    "delanteros tipo McPherson, incluyendo la compresión "
                    "segura del resorte y el montaje del conjunto."
                ),
                "dificultad": "dificil",
                "tiempo_estimado": "3 horas",
                "pieza": "Amortiguador",
            },
            "pasos": [
                {
                    "numero_paso": 1,
                    "titulo": "Elevación y desmontaje de la rueda",
                    "instruccion": (
                        "Afloje las tuercas de la rueda con el vehículo "
                        "en el suelo. Eleve el vehículo y colóquelo sobre "
                        "caballetes. Retire la rueda. Localice la torre "
                        "del amortiguador en el compartimento del motor "
                        "(3 tuercas superiores)."
                    ),
                    "imagen_url": "/static/img/guias/amortiguador_paso1.png",
                    "advertencia": (
                        "El conjunto resorte-amortiguador está bajo gran "
                        "tensión. Use siempre compresores de resortes "
                        "homologados."
                    ),
                },
                {
                    "numero_paso": 2,
                    "titulo": "Desconexión de componentes",
                    "instruccion": (
                        "Desconecte el sensor ABS si está presente. "
                        "Retire el tornillo que une el amortiguador a la "
                        "mangueta. Desconecte la bieleta de la barra "
                        "estabilizadora. Retire las 3 tuercas superiores "
                        "de la torre."
                    ),
                    "imagen_url": "/static/img/guias/amortiguador_paso2.png",
                    "advertencia": (
                        "No retire la tuerca central superior del vástago "
                        "del amortiguador sin comprimir el resorte primero."
                    ),
                },
                {
                    "numero_paso": 3,
                    "titulo": "Compresión del resorte y cambio",
                    "instruccion": (
                        "Con el conjunto fuera del vehículo, instale los "
                        "compresores de resorte y comprima el muelle hasta "
                        "que quede libre la tuerca superior. Retire la tuerca "
                        "del vástago, el plato superior y el resorte. Monte "
                        "todo sobre el amortiguador nuevo en orden inverso."
                    ),
                    "imagen_url": "/static/img/guias/amortiguador_paso3.png",
                    "advertencia": (
                        "PELIGRO: Un resorte comprimido almacena energía "
                        "suficiente para causar lesiones graves. Verifique "
                        "que los compresores estén bien sujetos."
                    ),
                },
                {
                    "numero_paso": 4,
                    "titulo": "Montaje e instalación final",
                    "instruccion": (
                        "Instale el conjunto en el vehículo. Apriete las "
                        "tuercas de la torre al par especificado. Conecte "
                        "la mangueta, la bieleta estabilizadora y el sensor "
                        "ABS. Monte la rueda. Baje el vehículo y apriete "
                        "todo al par final con el peso sobre las ruedas."
                    ),
                    "imagen_url": "/static/img/guias/amortiguador_paso4.png",
                    "advertencia": (
                        "Después del reemplazo es obligatorio realizar una "
                        "alineación de dirección en un taller especializado."
                    ),
                },
            ],
        },
    ]

    for guia_pasos in guias_pasos:
        guia_data = guia_pasos["guia"]
        pieza_nombre = guia_data.pop("pieza")
        guia = GuiaReparacion(
            pieza_id=piezas[pieza_nombre].id,
            **guia_data,
        )
        db.session.add(guia)
        db.session.flush()

        for paso_data in guia_pasos["pasos"]:
            paso = PasoGuia(guia_id=guia.id, **paso_data)
            db.session.add(paso)

    # =========================================================================
    # Relaciones de acople entre piezas (ensamblaje automotriz)
    # =========================================================================
    relaciones_data = [
        {
            "origen": "Pistón",
            "destino": "Cigüeñal",
            "tipo": "conecta_con",
            "descripcion": (
                "El pistón se conecta al cigüeñal a través de la biela, "
                "transmitiendo la fuerza de combustión."
            ),
        },
        {
            "origen": "Cigüeñal",
            "destino": "Correa de Distribución",
            "tipo": "conecta_con",
            "descripcion": (
                "El cigüeñal acciona la correa de distribución a través "
                "de su polea dentada delantera."
            ),
        },
        {
            "origen": "Correa de Distribución",
            "destino": "Árbol de Levas",
            "tipo": "conecta_con",
            "descripcion": (
                "La correa de distribución sincroniza la rotación del "
                "árbol de levas con el cigüeñal."
            ),
        },
        {
            "origen": "Alternador",
            "destino": "Batería",
            "tipo": "conecta_con",
            "descripcion": (
                "El alternador recarga la batería mientras el motor "
                "está en funcionamiento."
            ),
        },
        {
            "origen": "Bujía de Encendido",
            "destino": "Pistón",
            "tipo": "se_ensambla_en",
            "descripcion": (
                "La bujía se instala en la culata, justo encima de la "
                "cámara de combustión donde se desplaza el pistón."
            ),
        },
        {
            "origen": "Pastilla de Freno",
            "destino": "Caliper de Freno",
            "tipo": "se_ensambla_en",
            "descripcion": (
                "Las pastillas de freno se alojan dentro del caliper, "
                "siendo presionadas por el pistón hidráulico."
            ),
        },
        {
            "origen": "Caliper de Freno",
            "destino": "Disco de Freno",
            "tipo": "se_ensambla_en",
            "descripcion": (
                "El caliper se monta sobre el disco de freno, "
                "envolviendo una sección del mismo."
            ),
        },
        {
            "origen": "Amortiguador",
            "destino": "Resorte Helicoidal",
            "tipo": "se_ensambla_en",
            "descripcion": (
                "El resorte helicoidal se monta alrededor del "
                "amortiguador en el conjunto McPherson."
            ),
        },
        {
            "origen": "Rótula de Suspensión",
            "destino": "Amortiguador",
            "tipo": "conecta_con",
            "descripcion": (
                "La rótula conecta el brazo de control inferior "
                "con la mangueta que sostiene el conjunto "
                "amortiguador-resorte."
            ),
        },
        {
            "origen": "Disco de Embrague",
            "destino": "Cigüeñal",
            "tipo": "conecta_con",
            "descripcion": (
                "El disco de embrague se acopla al volante de inercia "
                "solidario al cigüeñal para transmitir el par motor."
            ),
        },
        {
            "origen": "Junta Homocinética",
            "destino": "Disco de Embrague",
            "tipo": "requiere",
            "descripcion": (
                "La junta homocinética requiere que el embrague "
                "transmita el par desde el motor para llevar la "
                "potencia a las ruedas."
            ),
        },
        {
            "origen": "Batería",
            "destino": "Bujía de Encendido",
            "tipo": "requiere",
            "descripcion": (
                "La batería suministra la energía eléctrica inicial "
                "que la bobina transforma para generar la chispa "
                "en la bujía."
            ),
        },
    ]

    for rel_data in relaciones_data:
        relacion = RelacionAcople(
            pieza_origen_id=piezas[rel_data["origen"]].id,
            pieza_destino_id=piezas[rel_data["destino"]].id,
            tipo_relacion=rel_data["tipo"],
            descripcion=rel_data["descripcion"],
        )
        db.session.add(relacion)

    # Confirmar todos los cambios en la base de datos
    db.session.commit()
    print("Base de datos poblada exitosamente con datos de semilla.")

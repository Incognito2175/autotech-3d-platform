/**
 * Visor3D.jsx — Motor 3D Interactivo con Three.js
 *
 * Renderizado WebGL, simulación de piezas automotrices, vista explotada
 * (desensamblaje/ensamblaje), selección interactiva con Raycasting, modo malla
 * (Wireframe), rotación automática e integración con el catálogo y guías de la API.
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getGuias, getPiezas } from '../api.js'

const PIECES_DATA = [
  {
    id: 'engine_block',
    keywords: ['bloque', 'motor', 'cilindro'],
    name: 'Bloque de Motor (4 Cilindros)',
    category: 'Motor',
    assembledPos: [0, 0, 0],
    explodedPos: [0, -1.8, 0],
    color: 0x4a5568,
    description:
      'Estructura principal fundida en aleación de aluminio donde se alojan los cilindros, conductos de lubricación y refrigerante.',
    functionText:
      'Soporta las presiones extremas de combustión y sirve de anclaje para el cigüeñal y la culata.',
    createMesh: () => {
      const group = new THREE.Group()
      const blockGeo = new THREE.BoxGeometry(3.2, 2.2, 2.2)
      const blockMat = new THREE.MeshStandardMaterial({
        color: 0x4a5568,
        metalness: 0.8,
        roughness: 0.35,
      })
      const block = new THREE.Mesh(blockGeo, blockMat)
      block.castShadow = true
      block.receiveShadow = true
      group.add(block)

      for (let i = 0; i < 4; i++) {
        const cylGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 24)
        const cylMat = new THREE.MeshStandardMaterial({
          color: 0x1a202c,
          metalness: 0.9,
          roughness: 0.2,
        })
        const cyl = new THREE.Mesh(cylGeo, cylMat)
        cyl.position.set(-1.05 + i * 0.7, 1.05, 0)
        group.add(cyl)
      }
      return group
    },
  },
  {
    id: 'piston',
    keywords: ['piston', 'pistón', 'biela'],
    name: 'Pistón y Biela Forjada',
    category: 'Motor',
    assembledPos: [-0.35, 0.4, 0],
    explodedPos: [-0.35, 2.6, 0],
    color: 0xd1d5db,
    description:
      'Pistón de aleación ligera con falda grafitada y biela de acero forjado con cojinetes trimetálicos.',
    functionText:
      'Convierte la energía térmica de la combustión en movimiento rectilíneo alternativo y lo transmite al cigüeñal.',
    createMesh: () => {
      const group = new THREE.Group()
      const headGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 32)
      const headMat = new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        metalness: 0.95,
        roughness: 0.2,
      })
      const head = new THREE.Mesh(headGeo, headMat)
      head.position.y = 0.5
      head.castShadow = true
      group.add(head)

      const rodGeo = new THREE.CylinderGeometry(0.06, 0.08, 1.1, 16)
      const rodMat = new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        metalness: 0.85,
        roughness: 0.3,
      })
      const rod = new THREE.Mesh(rodGeo, rodMat)
      rod.position.y = -0.3
      rod.castShadow = true
      group.add(rod)

      const eyeGeo = new THREE.TorusGeometry(0.14, 0.05, 12, 24)
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.25,
      })
      const eye = new THREE.Mesh(eyeGeo, eyeMat)
      eye.position.y = -0.85
      eye.rotation.x = Math.PI / 2
      group.add(eye)
      return group
    },
  },
  {
    id: 'spark_plug',
    keywords: ['bujia', 'bujía', 'encendido'],
    name: 'Bujía de Encendido Iridio',
    category: 'Sistema Eléctrico',
    assembledPos: [0.35, 1.25, 0],
    explodedPos: [0.35, 3.8, 0],
    color: 0xf9fafb,
    description:
      'Bujía de alto rendimiento con electrodo central de iridio y aislador cerámico corrugado.',
    functionText:
      'Genera el arco voltaico de alta tensión para inflamar la mezcla de aire y combustible en la cámara.',
    createMesh: () => {
      const group = new THREE.Group()
      const ceramicGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 24)
      const ceramicMat = new THREE.MeshStandardMaterial({
        color: 0xf9fafb,
        roughness: 0.1,
        metalness: 0.1,
      })
      const ceramic = new THREE.Mesh(ceramicGeo, ceramicMat)
      ceramic.position.y = 0.45
      group.add(ceramic)

      const threadGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.5, 24)
      const threadMat = new THREE.MeshStandardMaterial({
        color: 0x6b7280,
        metalness: 0.9,
        roughness: 0.3,
      })
      const thread = new THREE.Mesh(threadGeo, threadMat)
      thread.position.y = -0.15
      group.add(thread)

      const tipGeo = new THREE.ConeGeometry(0.04, 0.15, 16)
      const tipMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 1.0,
        roughness: 0.1,
        emissive: 0xd97706,
        emissiveIntensity: 0.3,
      })
      const tip = new THREE.Mesh(tipGeo, tipMat)
      tip.position.y = -0.45
      tip.rotation.x = Math.PI
      group.add(tip)
      return group
    },
  },
  {
    id: 'brake_disc',
    keywords: ['disco', 'freno', 'pastilla', 'caliper'],
    name: 'Disco de Freno Ventilado',
    category: 'Frenos',
    assembledPos: [-2.6, 0, 0],
    explodedPos: [-4.5, 0, 0],
    color: 0x94a3b8,
    description:
      'Disco de hierro fundido nodular con canales internos de ventilación radial y pista perforada.',
    functionText:
      'Disipa la energía cinética del vehículo en forma de calor mediante fricción con las pastillas.',
    createMesh: () => {
      const group = new THREE.Group()
      const discGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 48)
      const discMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.92,
        roughness: 0.25,
      })
      const disc = new THREE.Mesh(discGeo, discMat)
      disc.rotation.z = Math.PI / 2
      disc.castShadow = true
      group.add(disc)

      const hubGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.28, 32)
      const hubMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.85,
        roughness: 0.4,
      })
      const hub = new THREE.Mesh(hubGeo, hubMat)
      hub.rotation.z = Math.PI / 2
      group.add(hub)

      const holeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.32, 24)
      const holeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a })
      const hole = new THREE.Mesh(holeGeo, holeMat)
      hole.rotation.z = Math.PI / 2
      group.add(hole)
      return group
    },
  },
  {
    id: 'alternator',
    keywords: ['alternador', 'bateria', 'batería'],
    name: 'Alternador Trifásico 12V 120A',
    category: 'Sistema Eléctrico',
    assembledPos: [2.4, 0.6, 0],
    explodedPos: [4.2, 1.2, 0],
    color: 0xb45309,
    description:
      'Generador síncrono de corriente alterna con puente rectificador de diodos y regulador incorporado.',
    functionText:
      'Suministra energía eléctrica a todos los sistemas del vehículo y recarga la batería mientras el motor gira.',
    createMesh: () => {
      const group = new THREE.Group()
      const bodyGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 32)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.75,
        roughness: 0.35,
      })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      body.rotation.x = Math.PI / 2
      group.add(body)

      const coilGeo = new THREE.TorusGeometry(0.66, 0.1, 16, 32)
      const coilMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        metalness: 0.85,
        roughness: 0.3,
      })
      const coil = new THREE.Mesh(coilGeo, coilMat)
      group.add(coil)

      const pulleyGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 24)
      const pulleyMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2,
      })
      const pulley = new THREE.Mesh(pulleyGeo, pulleyMat)
      pulley.rotation.x = Math.PI / 2
      pulley.position.z = 0.58
      group.add(pulley)
      return group
    },
  },
  {
    id: 'transmission_gear',
    keywords: ['engranaje', 'transmision', 'transmisión', 'embrague', 'homocinetica', 'homocinética'],
    name: 'Engranaje Helicoidal de Transmisión',
    category: 'Transmisión',
    assembledPos: [0, -1.2, 1.4],
    explodedPos: [0, -2.5, 3.2],
    color: 0xd97706,
    description:
      'Engranaje de dientes helicoidales fabricado en acero cementado para alta transferencia de par.',
    functionText:
      'Transmite la fuerza motriz entre ejes paralelos reduciendo el ruido y aumentando el área de contacto.',
    createMesh: () => {
      const group = new THREE.Group()
      const gearGeo = new THREE.TorusKnotGeometry(0.55, 0.16, 64, 16, 2, 5)
      const gearMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.9,
        roughness: 0.25,
      })
      const gear = new THREE.Mesh(gearGeo, gearMat)
      gear.castShadow = true
      group.add(gear)

      const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 24)
      const shaftMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.95,
        roughness: 0.2,
      })
      const shaft = new THREE.Mesh(shaftGeo, shaftMat)
      group.add(shaft)
      return group
    },
  },
  {
    id: 'shock_absorber',
    keywords: ['amortiguador', 'resorte', 'suspension', 'suspensión', 'rotula', 'rótula'],
    name: 'Amortiguador MacPherson con Resorte',
    category: 'Suspensión',
    assembledPos: [2.4, -0.8, -0.5],
    explodedPos: [4.2, -2.0, -1.5],
    color: 0x2563eb,
    description:
      'Puntal telescópico hidráulico con resorte helicoidal concéntrico y tope elástico de fin de carrera.',
    functionText:
      'Absorbe las irregularidades de la calzada manteniendo el contacto de las ruedas y la estabilidad dinámica.',
    createMesh: () => {
      const group = new THREE.Group()
      const tubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.4, 24)
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        metalness: 0.8,
        roughness: 0.3,
      })
      const tube = new THREE.Mesh(tubeGeo, tubeMat)
      group.add(tube)

      const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16)
      const rodMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.98,
        roughness: 0.05,
      })
      const rod = new THREE.Mesh(rodGeo, rodMat)
      rod.position.y = 0.9
      group.add(rod)

      const springGeo = new THREE.TorusGeometry(0.32, 0.04, 12, 32)
      const springMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.7,
        roughness: 0.3,
      })
      for (let i = -3; i <= 3; i++) {
        const coil = new THREE.Mesh(springGeo, springMat)
        coil.rotation.x = Math.PI / 2
        coil.position.y = i * 0.18
        group.add(coil)
      }
      return group
    },
  },
]

export default function Visor3D() {
  const [searchParams] = useSearchParams()
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const piecesRef = useRef([])
  const selectedGroupRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [isExploded, setIsExploded] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [wireframeMode, setWireframeMode] = useState(false)

  const [apiPiezas, setApiPiezas] = useState([])
  const [apiGuias, setApiGuias] = useState([])

  // Cargar piezas y guías reales desde el backend para vincularlas al modelo 3D
  useEffect(() => {
    Promise.all([getPiezas(), getGuias()])
      .then(([ps, gs]) => {
        setApiPiezas(ps)
        setApiGuias(gs)
      })
      .catch(() => {})
  }, [])

  const highlightPiece = (group, enable) => {
    if (!group) return
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        if (enable) {
          child.userData.savedEmissive = child.material.emissive
            ? child.material.emissive.getHex()
            : 0
          child.userData.savedEmissiveIntensity = child.material.emissiveIntensity || 0
          child.material.emissive = new THREE.Color(0x00d4ff)
          child.material.emissiveIntensity = 0.5
        } else {
          const prevEmissive =
            child.userData.savedEmissive !== undefined ? child.userData.savedEmissive : 0
          const prevIntensity =
            child.userData.savedEmissiveIntensity !== undefined
              ? child.userData.savedEmissiveIntensity
              : 0
          child.material.emissive = new THREE.Color(prevEmissive)
          child.material.emissiveIntensity = prevIntensity
        }
      }
    })
  }

  const selectPieceByGroup = (pieceGroup) => {
    if (selectedGroupRef.current) {
      highlightPiece(selectedGroupRef.current, false)
    }

    if (pieceGroup) {
      selectedGroupRef.current = pieceGroup
      highlightPiece(pieceGroup, true)
      setSelectedId(pieceGroup.userData.id)
      if (controlsRef.current) {
        controlsRef.current.target.lerp(pieceGroup.position, 0.5)
      }
    } else {
      selectedGroupRef.current = null
      setSelectedId(null)
    }
  }

  const selectPieceById = (id) => {
    const found = piecesRef.current.find((p) => p.userData.id === id)
    if (found) selectPieceByGroup(found)
  }

  // Inicializar escena Three.js
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0c101d)
    scene.fog = new THREE.FogExp2(0x0c101d, 0.04)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    )
    camera.position.set(4, 3.5, 7.5)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.maxDistance = 20
    controls.minDistance = 2
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    // Iluminación de estudio
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
    keyLight.position.set(6, 10, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 25
    keyLight.shadow.bias = -0.0005
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x00d4ff, 0.8)
    fillLight.position.set(-8, 4, -4)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.6)
    rimLight.position.set(0, -5, -6)
    scene.add(rimLight)

    // Rejilla tecnológica
    const gridHelper = new THREE.GridHelper(16, 32, 0x00d4ff, 0x1f2c45)
    gridHelper.position.y = -2.2
    scene.add(gridHelper)

    // Construcción de las 7 piezas 3D
    const builtPieces = []
    PIECES_DATA.forEach((data) => {
      const meshGroup = data.createMesh()
      const assembled = new THREE.Vector3(...data.assembledPos)
      const exploded = new THREE.Vector3(...data.explodedPos)

      meshGroup.position.copy(assembled)
      meshGroup.userData = {
        id: data.id,
        name: data.name,
        category: data.category,
        description: data.description,
        functionText: data.functionText,
        assembledPos: assembled.clone(),
        explodedPos: exploded.clone(),
        targetPos: assembled.clone(),
      }

      meshGroup.traverse((child) => {
        if (child.isMesh) {
          child.userData.parentPiece = meshGroup
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      scene.add(meshGroup)
      builtPieces.push(meshGroup)
    })
    piecesRef.current = builtPieces

    // Si viene ?pieza=... en la URL, seleccionar la pieza correspondiente
    const piezaQuery = (searchParams.get('pieza') || '').toLowerCase()
    if (piezaQuery) {
      const matchData = PIECES_DATA.find(
        (d) =>
          d.name.toLowerCase().includes(piezaQuery) ||
          d.keywords.some((kw) => piezaQuery.includes(kw))
      )
      if (matchData) {
        const matchGroup = builtPieces.find((p) => p.userData.id === matchData.id)
        if (matchGroup) {
          selectPieceByGroup(matchGroup)
        }
      }
    }

    // Raycasting
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerDown = (event) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      for (const hit of intersects) {
        if (hit.object.userData && hit.object.userData.parentPiece) {
          selectPieceByGroup(hit.object.userData.parentPiece)
          return
        }
      }
    }

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      let foundPiece = null
      for (const hit of intersects) {
        if (hit.object.userData && hit.object.userData.parentPiece) {
          foundPiece = hit.object.userData.parentPiece
          break
        }
      }
      canvas.style.cursor = foundPiece ? 'pointer' : 'default'
    }

    const onWindowResize = () => {
      if (!container || !renderer || !camera) return
      const width = container.clientWidth
      const height = Math.max(container.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    window.addEventListener('resize', onWindowResize)

    setLoading(false)

    let animationFrameId = null
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      builtPieces.forEach((piece) => {
        if (piece.position.distanceTo(piece.userData.targetPos) > 0.005) {
          piece.position.lerp(piece.userData.targetPos, 0.08)
        }
      })
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onWindowResize)
      controls.dispose()
      renderer.dispose()
      piecesRef.current = []
      selectedGroupRef.current = null
    }
  }, [searchParams])

  // Acciones de controles
  const handleExplode = () => {
    setIsExploded(true)
    piecesRef.current.forEach((p) => {
      p.userData.targetPos.copy(p.userData.explodedPos)
    })
  }

  const handleAssemble = () => {
    setIsExploded(false)
    piecesRef.current.forEach((p) => {
      p.userData.targetPos.copy(p.userData.assembledPos)
    })
  }

  const handleToggleAutoRotate = () => {
    const next = !autoRotate
    setAutoRotate(next)
    if (controlsRef.current) {
      controlsRef.current.autoRotate = next
      controlsRef.current.autoRotateSpeed = 2.0
    }
  }

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(4, 3.5, 7.5)
      controlsRef.current.target.set(0, 0, 0)
    }
    selectPieceByGroup(null)
  }

  const handleToggleWireframe = () => {
    const next = !wireframeMode
    setWireframeMode(next)
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = next
        }
      })
    }
  }

  const selectedData = PIECES_DATA.find((p) => p.id === selectedId) || null

  // Buscar coincidencia en MySQL (piezas y guías reales)
  const matchedApiPieza = selectedData
    ? apiPiezas.find((ap) =>
        selectedData.keywords.some((kw) => ap.nombre.toLowerCase().includes(kw))
      )
    : null

  const matchedApiGuia = selectedData
    ? apiGuias.find(
        (ag) =>
          (matchedApiPieza && ag.pieza_id === matchedApiPieza.id) ||
          selectedData.keywords.some((kw) => (ag.pieza_nombre || '').toLowerCase().includes(kw))
      )
    : null

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h2 fw-bold text-white mb-1">
            🔩 Visor 3D Interactivo de Componentes
          </h1>
          <p className="text-muted small mb-0">
            Explora las piezas mecánicas en 3D, examina su estructura interna y observa el ensamblaje en tiempo real.
          </p>
        </div>
      </div>

      <div className="viewer-container">
        <div ref={containerRef} className="canvas-container">
          <canvas ref={canvasRef} className="canvas-3d" />
          {loading && (
            <div className="canvas-loading">
              <div>⚙️ Cargando motor 3D interactivo...</div>
            </div>
          )}
          <div className="canvas-overlay-tip">
            🖱️ <strong>Click izquierdo + arrastrar:</strong> Rotar |{' '}
            <strong>Rueda:</strong> Zoom | <strong>Click derecho:</strong> Mover |{' '}
            <strong>Click en pieza:</strong> Seleccionar
          </div>
        </div>

        <div className="viewer-sidebar">
          <div className="controls-panel">
            <h3>🎮 Controles de Ensamblaje</h3>
            <div className="btn-group-custom">
              <button
                type="button"
                className={`btn-action ${isExploded ? 'active' : ''}`}
                onClick={handleExplode}
              >
                💥 Desarmar
              </button>
              <button
                type="button"
                className={`btn-action ${!isExploded ? 'active' : ''}`}
                onClick={handleAssemble}
              >
                🔧 Ensamblar
              </button>
              <button
                type="button"
                className={`btn-action ${autoRotate ? 'active' : ''}`}
                onClick={handleToggleAutoRotate}
              >
                🔄 Rotar Auto
              </button>
              <button type="button" className="btn-action" onClick={handleResetCamera}>
                🎯 Centrar
              </button>
            </div>
            <button
              type="button"
              className={`btn-action ${wireframeMode ? 'active' : ''}`}
              style={{ width: '100%' }}
              onClick={handleToggleWireframe}
            >
              🕸️ Alternar Modo Malla (Wireframe)
            </button>
          </div>

          <div className="controls-panel">
            <h3>📦 Piezas en el Conjunto</h3>
            <ul className="part-list">
              {PIECES_DATA.map((p) => (
                <li
                  key={p.id}
                  className={`part-item ${selectedId === p.id ? 'selected' : ''}`}
                  onClick={() => selectPieceById(p.id)}
                >
                  <span>{p.name}</span>
                  <span
                    className="part-dot"
                    style={{
                      backgroundColor: `#${p.color.toString(16).padStart(6, '0')}`,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <h4>{selectedData ? selectedData.name : 'Selecciona una pieza'}</h4>
            <span className="info-badge">
              {selectedData ? selectedData.category : 'AutoTech 3D'}
            </span>
            <p style={{ fontSize: '0.86rem', color: '#a5b4cb', lineHeight: 1.5 }}>
              {selectedData
                ? matchedApiPieza?.descripcion || selectedData.description
                : 'Haz clic en cualquier pieza del visor o en la lista lateral para inspeccionar sus características técnicas, función y relaciones de acople.'}
            </p>

            {selectedData && (
              <div
                style={{
                  marginTop: '0.9rem',
                  borderTop: '1px solid #23334d',
                  paddingTop: '0.75rem',
                }}
              >
                <p style={{ fontSize: '0.8rem', color: '#70a1ff', marginBottom: '0.25rem' }}>
                  <strong>Función en el vehículo:</strong>
                </p>
                <p style={{ fontSize: '0.83rem', color: '#d0d8e8' }}>
                  {matchedApiPieza?.funcion || selectedData.functionText}
                </p>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <Link
                    to={matchedApiGuia ? `/guias/${matchedApiGuia.id}` : '/guias'}
                    className="btn-action"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    📖 {matchedApiGuia ? 'Ver Guía de esta Pieza' : 'Ver Guías'}
                  </Link>
                  {matchedApiPieza && (
                    <Link
                      to={`/catalogo/${matchedApiPieza.id}`}
                      className="btn-action"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      🔩 Ficha & Acople
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

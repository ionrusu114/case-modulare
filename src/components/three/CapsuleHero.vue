<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace,
  Group, Box3, Vector3, Mesh, MeshStandardMaterial, MeshPhysicalMaterial,
  HemisphereLight, DirectionalLight, AmbientLight, PointLight, PMREMGenerator,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { heroProgress, heroPointer } from '@/composables/useHeroProgress'

const emit = defineEmits<{ ready: [] }>()
const host = ref<HTMLDivElement>()

let renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera
let model: Group | undefined
let raf = 0
let ro: ResizeObserver | undefined
const BASE_Y = -0.5
const SPREAD = 1.25 // how far parts fly apart at full explode
const camBase = new Vector3()
const lookTarget = new Vector3(0, 0, 0)

// part -> {mesh, base position, explode direction (model-local)}
const parts: { mesh: Mesh; base: Vector3; dir: Vector3 }[] = []

function explodeDir(name: string, fromCenter: Vector3): Vector3 {
  const n = name.toLowerCase()
  const d = fromCenter.clone()
  // roof lifts, base/feet drop — give them a strong vertical component
  if (n.includes('roof')) return new Vector3(0, 1, 0).addScaledVector(d, 0.2)
  if (n.includes('base') || n.includes('foot')) return new Vector3(0, -1, 0).addScaledVector(d, 0.2)
  // shell is the core: barely drifts back so panels read against it
  if (n.includes('shell')) return new Vector3(0, 0, -0.25)
  // glass + frames pull outward toward the viewer (facade opens)
  if (n.includes('glass') || n.includes('frame')) { d.z += 1.1; return d }
  if (n.includes('door')) return new Vector3(0, -0.05, 1.4)
  // everything else (interior pieces, walls) flies radially out
  return d
}

function buildParts() {
  if (!model) return
  const C = new Box3().setFromObject(model).getCenter(new Vector3())
  model.traverse((o) => {
    const m = o as Mesh
    if (!(m as Mesh).isMesh) return
    const wc = new Box3().setFromObject(m).getCenter(new Vector3())
    const dir = explodeDir(`${(m.material as MeshStandardMaterial)?.name ?? ''} ${m.name}`, wc.sub(C))
    parts.push({ mesh: m, base: m.position.clone(), dir })
  })
}

function frameModel() {
  if (!model || !camera) return
  const box = new Box3().setFromObject(model)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  model.position.sub(center)
  model.position.x = size.x * 0.14
  model.position.y = -size.y * 0.16
  const maxDim = Math.max(size.x, size.z)
  const fov = (camera.fov * Math.PI) / 180
  const dist = (maxDim / 2 / Math.tan(fov / 2)) * 1.34
  camBase.set(dist * 0.58, size.y * 0.5, dist * 0.82)
  lookTarget.set(0, 0, 0)
  camera.position.copy(camBase)
  camera.lookAt(lookTarget)
}

function loop() {
  raf = requestAnimationFrame(loop)
  const e = heroProgress.value // 0 assembled -> 1 fully exploded
  if (model) {
    for (const p of parts) p.mesh.position.copy(p.base).addScaledVector(p.dir, e * SPREAD)
    model.rotation.y = BASE_Y + e * 0.5 + heroPointer.value.x * 0.16
    model.rotation.x = heroPointer.value.y * 0.025
    // dolly back as it opens so the spread parts stay in frame
    camera.position.copy(camBase).multiplyScalar(1 + e * 0.34)
    camera.lookAt(lookTarget)
  }
  renderer.render(scene, camera)
}

function resize() {
  if (!host.value || !renderer) return
  const { clientWidth: w, clientHeight: h } = host.value
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

onMounted(() => {
  const el = host.value!
  scene = new Scene()
  scene.background = null
  camera = new PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 100)

  renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
  renderer.setSize(el.clientWidth, el.clientHeight, false)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  el.appendChild(renderer.domElement)
  Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' })

  const pmrem = new PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  scene.add(new HemisphereLight(0xfff4e6, 0x20201c, 0.55))
  scene.add(new AmbientLight(0xffffff, 0.2))
  const key = new DirectionalLight(0xfff0dc, 2.6)
  key.position.set(6, 9, 6)
  scene.add(key)
  const rim = new DirectionalLight(0xe8a14d, 1.7)
  rim.position.set(-7, 3, -5)
  scene.add(rim)
  const interior = new PointLight(0xffcaa0, 7, 12, 2)
  interior.position.set(0, 1.2, 0)
  scene.add(interior)

  new GLTFLoader().load(
    '/models/capsule.glb',
    (gltf) => {
      model = gltf.scene
      model.traverse((o) => {
        const m = o as Mesh
        if (!(m as Mesh).isMesh) return
        const mat = m.material as MeshStandardMaterial
        const tag = `${mat?.name ?? ''} ${m.name}`.toLowerCase()
        if (tag.includes('glass')) {
          const g = mat as MeshPhysicalMaterial
          g.transmission = Math.max(g.transmission ?? 0, 0.9)
          g.roughness = 0.06
          g.envMapIntensity = 1.3
        }
      })
      scene.add(model)
      frameModel()
      buildParts()
      resize()
      emit('ready')
    },
    undefined,
    () => emit('ready'),
  )

  resize()
  ro = new ResizeObserver(resize)
  ro.observe(el)
  loop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  model?.traverse((o) => {
    const m = o as Mesh
    if ((m as Mesh).isMesh) {
      m.geometry?.dispose()
      const mm = m.material
      Array.isArray(mm) ? mm.forEach((x) => x.dispose()) : mm?.dispose()
    }
  })
  renderer?.dispose()
})
</script>

<template>
  <div ref="host" class="h-full w-full" />
</template>

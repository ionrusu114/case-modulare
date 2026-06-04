<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Scene, PerspectiveCamera, WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace,
  Group, Box3, Vector3, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, PlaneGeometry,
  HemisphereLight, DirectionalLight, AmbientLight, PMREMGenerator, Raycaster, PCFSoftShadowMap,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'

const props = defineProps<{ bodyColor: string; view: 'exterior' | 'interior' }>()
const emit = defineEmits<{ select: [id: string]; ready: [] }>()

const host = ref<HTMLDivElement>()
const markers = ref<{ id: string; x: number; y: number; visible: boolean }[]>([])

// Hotspots map to named meshes in punct-paza.glb (see Blender export).
const HS: { id: string; match: (n: string) => boolean }[] = [
  { id: 'usa', match: (n) => n.includes('door') && !n.includes('handle') && !n.includes('glass') && !n.includes('interior') },
  { id: 'fereastra', match: (n) => n.includes('window_front_l') },
  { id: 'ac', match: (n) => n.includes('interior_ac') },
  { id: 'structura', match: (n) => n.includes('corner') },
  { id: 'panou', match: (n) => n.includes('body_left') || n.includes('body_back') },
  { id: 'birou', match: (n) => n.includes('desk') },
]
const anchors: { id: string; pos: Vector3 }[] = []

let renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, controls: OrbitControls
let model: Group | undefined
let raf = 0
let ro: ResizeObserver | undefined
const bodyMats: MeshStandardMaterial[] = []
const occluders: Mesh[] = []
const ray = new Raycaster()
let interiorR = 0.7
const VIEWS = {
  exterior: { pos: new Vector3(4.4, 2.4, 5), target: new Vector3(0, 1.3, 0) },
  interior: { pos: new Vector3(0, 1.45, 0.7), target: new Vector3(0, 1.35, 0) },
}

function applyColor(hex: string) {
  for (const m of bodyMats) m.color.set(hex)
}

function setupModel(root: Group) {
  model = root
  // recenter on X/Z, drop base to Y=0
  let box = new Box3().setFromObject(model)
  const c = box.getCenter(new Vector3())
  model.position.x -= c.x
  model.position.z -= c.z
  model.position.y -= box.min.y
  model.updateMatrixWorld(true)

  model.traverse((o) => {
    const m = o as Mesh
    if (!(m as Mesh).isMesh) return
    m.castShadow = true
    m.receiveShadow = true
    const list = Array.isArray(m.material) ? m.material : [m.material]
    let isGlass = false
    for (const mm of list as MeshStandardMaterial[]) {
      if (mm?.name === 'Body') bodyMats.push(mm)
      if (/glass/i.test(mm?.name ?? '')) {
        isGlass = true
        const g = mm as MeshPhysicalMaterial
        g.transmission = Math.max(g.transmission ?? 0, 0.85)
        g.roughness = 0.08
        g.envMapIntensity = 1.2
      }
    }
    if (!isGlass) occluders.push(m)
  })
  scene.add(model)

  // frame from final bounds
  box = new Box3().setFromObject(model)
  const size = box.getSize(new Vector3())
  const maxDim = Math.max(size.x, size.z)
  const fov = (camera.fov * Math.PI) / 180
  const dist = (maxDim / 2 / Math.tan(fov / 2)) * 1.5
  // Door/front faces -Z after the glTF Y-up conversion → view from -Z (front-right 3/4).
  VIEWS.exterior.pos.set(dist * 0.72, size.y * 0.6, -dist * 0.8)
  VIEWS.exterior.target.set(0, size.y * 0.42, 0)
  // Fixed eye-level inside (tuned to the ~2.85 m interior, not the full bounds incl. roof lugs).
  VIEWS.interior.target.set(0, 1.2, 0)
  VIEWS.interior.pos.set(0, 1.4, -0.75)
  interiorR = VIEWS.interior.pos.distanceTo(VIEWS.interior.target)

  for (const hs of HS) {
    let found: Vector3 | undefined
    model.traverse((o) => {
      const m = o as Mesh
      if (found || !(m as Mesh).isMesh) return
      if (hs.match(m.name.toLowerCase())) found = new Box3().setFromObject(m).getCenter(new Vector3())
    })
    if (found) anchors.push({ id: hs.id, pos: found })
  }
  markers.value = anchors.map((a) => ({ id: a.id, x: 0, y: 0, visible: false }))

  applyColor(props.bodyColor)
  camera.position.copy(VIEWS.exterior.pos)
  controls.target.copy(VIEWS.exterior.target)
  if (props.view === 'interior') animateView('interior')
  controls.update()
  emit('ready')
}

function updateMarkers() {
  if (!host.value || !model) return
  const rect = host.value.getBoundingClientRect()
  const cam = camera.position
  for (let i = 0; i < anchors.length; i++) {
    const a = anchors[i].pos
    const p = a.clone().project(camera)
    const onScreen = p.z < 1 && p.x > -1.05 && p.x < 1.05 && p.y > -1.05 && p.y < 1.05
    let occluded = false
    if (onScreen) {
      const dir = a.clone().sub(cam)
      const dist = dir.length()
      ray.set(cam, dir.normalize())
      ray.far = dist - 0.12
      occluded = ray.intersectObjects(occluders, false).length > 0
    }
    const m = markers.value[i]
    m.x = (p.x * 0.5 + 0.5) * rect.width
    m.y = (-p.y * 0.5 + 0.5) * rect.height
    m.visible = onScreen && !occluded
  }
}

function animateView(v: 'exterior' | 'interior') {
  const view = VIEWS[v]
  const interior = v === 'interior'
  gsap.to(camera.position, { x: view.pos.x, y: view.pos.y, z: view.pos.z, duration: 1.1, ease: 'power3.inOut', onUpdate: () => controls.update() })
  gsap.to(controls.target, { x: view.target.x, y: view.target.y, z: view.target.z, duration: 1.1, ease: 'power3.inOut', onUpdate: () => controls.update() })
  controls.enableZoom = !interior
  // Interior: lock radius -> only rotate around the room centre, never dolly/pan.
  controls.minDistance = interior ? interiorR : 3
  controls.maxDistance = interior ? interiorR : 11
  controls.minPolarAngle = interior ? 0.55 : 0
  controls.maxPolarAngle = interior ? 2.35 : Math.PI / 2 - 0.02
}

function loop() {
  raf = requestAnimationFrame(loop)
  controls.update()
  updateMarkers()
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
  camera = new PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.05, 100)
  camera.position.copy(VIEWS.exterior.pos)

  renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
  renderer.setSize(el.clientWidth, el.clientHeight, false)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  el.appendChild(renderer.domElement)
  Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' })

  const pmrem = new PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  scene.add(new HemisphereLight(0xffffff, 0x5a5a55, 0.5))
  scene.add(new AmbientLight(0xffffff, 0.22))
  const key = new DirectionalLight(0xfff2e0, 2.3)
  key.position.set(5, 8, 4)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.near = 1; key.shadow.camera.far = 30
  key.shadow.camera.left = -6; key.shadow.camera.right = 6
  key.shadow.camera.top = 6; key.shadow.camera.bottom = -6
  scene.add(key)

  const ground = new Mesh(new PlaneGeometry(50, 50), new MeshStandardMaterial({ color: 0x161513, roughness: 1 }))
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.target.copy(VIEWS.exterior.target)
  controls.minDistance = 3
  controls.maxDistance = 11
  controls.maxPolarAngle = Math.PI / 2 - 0.02

  new GLTFLoader().load('/models/punct-paza.glb', (gltf) => setupModel(gltf.scene), undefined, () => emit('ready'))

  resize()
  ro = new ResizeObserver(resize)
  ro.observe(el)
  loop()
})

watch(() => props.bodyColor, (c) => applyColor(c))
watch(() => props.view, (v) => animateView(v))

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  controls?.dispose()
  scene?.traverse((o) => {
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
  <div ref="host" class="relative h-full w-full">
    <button
      v-for="m in markers"
      :key="m.id"
      class="hotspot"
      :class="{ 'hotspot--hidden': !m.visible }"
      :style="{ left: m.x + 'px', top: m.y + 'px' }"
      :aria-label="`Detalii: ${m.id}`"
      @click="emit('select', m.id)"
    >
      <span class="hotspot__dot" />
      <span class="hotspot__ring" />
    </button>
  </div>
</template>

<style scoped>
.hotspot {
  position: absolute;
  width: 26px;
  height: 26px;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: opacity 0.25s ease;
  z-index: 2;
}
.hotspot--hidden { opacity: 0; pointer-events: none; }
.hotspot__dot {
  width: 13px; height: 13px; border-radius: 999px;
  background: var(--color-ember); border: 2px solid var(--color-ink);
  box-shadow: 0 2px 8px oklch(0 0 0 / 0.4);
}
.hotspot__ring {
  position: absolute; inset: 0; border-radius: 999px;
  border: 1.5px solid var(--color-ember);
  animation: hsPulse 2.4s ease-out infinite;
}
@keyframes hsPulse {
  0% { transform: scale(0.5); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .hotspot__ring { animation: none; } }
</style>

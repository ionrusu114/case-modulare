import { onMounted, onBeforeUnmount, type Ref, unref } from 'vue'

type Gsap = typeof import('gsap').gsap
type ScrollTriggerStatic = typeof import('gsap/ScrollTrigger').ScrollTrigger

// GSAP is loaded lazily after mount, so its ~115KB chunk never competes with first paint / LCP.
let lib: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerStatic }> | undefined
// Set once the chunk resolves. revealOnScroll only runs inside a setup callback, so it is ready there.
let loaded: Gsap | undefined

function loadGsap() {
  lib ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger)
    loaded = gsap
    return { gsap, ScrollTrigger }
  })
  return lib
}

// One ScrollTrigger.refresh per frame, however many sections finish their setup in it.
let refreshQueued = false
function queueRefresh(ScrollTrigger: ScrollTriggerStatic) {
  if (refreshQueued) return
  refreshQueued = true
  requestAnimationFrame(() => {
    refreshQueued = false
    ScrollTrigger.refresh()
  })
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Run GSAP setup inside a scoped context that is automatically reverted on
 * unmount (kills tweens + ScrollTriggers, restores inline styles). SSR-safe:
 * the callback only runs in the browser, after mount and after GSAP has loaded.
 */
export function useGsapContext(
  setup: (ctx: { gsap: Gsap; reduced: boolean }) => void,
  scope?: Ref<HTMLElement | undefined> | HTMLElement,
) {
  let ctx: ReturnType<Gsap['context']> | undefined
  let alive = true
  onMounted(async () => {
    let mod: Awaited<ReturnType<typeof loadGsap>>
    try {
      mod = await loadGsap()
    } catch {
      // Chunk failed to load: the page simply stays static (reveal content starts visible).
      return
    }
    // Each section's setup runs in its own task, so no single long task blocks the main thread.
    await new Promise((resolve) => setTimeout(resolve))
    if (!alive) return
    const reduced = prefersReducedMotion()
    // Resolve the scope to a real element here (refs are empty during setup).
    const el = unref(scope) as HTMLElement | undefined
    ctx = mod.gsap.context(() => setup({ gsap: mod.gsap, reduced }), el)
    // ScrollTrigger needs a refresh once fonts/layout settle.
    queueRefresh(mod.ScrollTrigger)
  })
  onBeforeUnmount(() => {
    alive = false
    ctx?.revert()
  })
}

/**
 * Run `cb` once per element when it enters the viewport, past the bottom `inset` (15% ≈ ScrollTrigger
 * start 'top 85%'). IntersectionObserver also catches anchor jumps, which skip scroll positions.
 */
export function whenInView(els: Element[], cb: (el: Element) => void, inset = '15%') {
  if (!els.length) return
  let left = els.length
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        io.unobserve(e.target)
        cb(e.target)
        if (--left === 0) io.disconnect()
      }
    },
    { rootMargin: `0px 0px -${inset} 0px` },
  )
  els.forEach((el) => io.observe(el))
}

/** Standard entrance for elements carrying the `.reveal` class. */
export function revealOnScroll(root: HTMLElement, selector = '.reveal', opts: { y?: number } = {}) {
  const gsap = loaded
  if (!gsap || prefersReducedMotion()) return
  // Only elements still below the fold get the hidden from-state: anything the visitor already
  // sees (e.g. scrolled there before hydration) stays as is, no hide-and-fade flash.
  const pending = [...root.querySelectorAll<HTMLElement>(selector)].filter(
    (el) => el.getBoundingClientRect().top >= window.innerHeight,
  )
  if (!pending.length) return
  gsap.set(pending, { opacity: 0, y: opts.y ?? 32 })
  whenInView(pending, (el) => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }))
}

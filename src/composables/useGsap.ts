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
    // From here GSAP owns the `.reveal` elements (CSS hides them, each setup reveals them).
    document.documentElement.classList.remove('no-js')
    return { gsap, ScrollTrigger }
  })
  return lib
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
      // Chunk failed to load: `no-js` stays on <html>, so reveal content stays visible.
      return
    }
    if (!alive) return
    const reduced = prefersReducedMotion()
    // Resolve the scope to a real element here (refs are empty during setup).
    const el = unref(scope) as HTMLElement | undefined
    ctx = mod.gsap.context(() => setup({ gsap: mod.gsap, reduced }), el)
    // ScrollTrigger needs a refresh once fonts/layout settle.
    requestAnimationFrame(() => mod.ScrollTrigger.refresh())
  })
  onBeforeUnmount(() => {
    alive = false
    ctx?.revert()
  })
}

/** Standard staggered reveal for elements carrying the `.reveal` class. */
export function revealOnScroll(
  root: HTMLElement,
  selector = '.reveal',
  opts: { y?: number; stagger?: number; start?: string } = {},
) {
  const gsap = loaded
  const els = root.querySelectorAll<HTMLElement>(selector)
  if (!gsap || !els.length) return
  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0 })
    return
  }
  els.forEach((el) => {
    // Already on screen (visitor scrolled before hydration): show as is, no hide-and-fade flash.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      gsap.set(el, { opacity: 1 })
      return
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: opts.y ?? 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: opts.start ?? 'top 85%' },
      },
    )
  })
}

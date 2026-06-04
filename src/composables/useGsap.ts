import { onMounted, onBeforeUnmount, type Ref, unref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false
function ensureRegistered() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Run GSAP setup inside a scoped context that is automatically reverted on
 * unmount (kills tweens + ScrollTriggers, restores inline styles). SSR-safe:
 * the callback only runs in the browser, after mount.
 */
export function useGsapContext(
  setup: (ctx: { gsap: typeof gsap; reduced: boolean }) => void,
  scope?: Ref<HTMLElement | undefined> | HTMLElement,
) {
  let ctx: gsap.Context | undefined
  onMounted(() => {
    ensureRegistered()
    const reduced = prefersReducedMotion()
    // Resolve the scope to a real element here (refs are empty during setup).
    const el = unref(scope) as HTMLElement | undefined
    ctx = gsap.context(() => setup({ gsap, reduced }), el)
    // ScrollTrigger needs a refresh once fonts/layout settle.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })
  onBeforeUnmount(() => ctx?.revert())
  return { gsap }
}

/** Standard staggered reveal for elements carrying the `.reveal` class. */
export function revealOnScroll(
  root: HTMLElement,
  selector = '.reveal',
  opts: { y?: number; stagger?: number; start?: string } = {},
) {
  const els = root.querySelectorAll<HTMLElement>(selector)
  if (!els.length) return
  if (prefersReducedMotion()) {
    gsap.set(els, { opacity: 1, y: 0 })
    return
  }
  els.forEach((el) => {
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

export { gsap, ScrollTrigger }

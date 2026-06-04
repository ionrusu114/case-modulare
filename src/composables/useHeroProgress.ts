import { ref } from 'vue'

// Bridges GSAP ScrollTrigger (DOM) and the three.js render loop (WebGL):
// HeroSection writes scroll progress here; CapsuleHero reads it each frame to
// rotate the capsule. 0 = top of hero, 1 = hero scrolled past.
export const heroProgress = ref(0)
export const heroPointer = ref({ x: 0, y: 0 })

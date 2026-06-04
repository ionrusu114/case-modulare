import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import Home from './pages/Home.vue'
import ProductPunctPaza from './pages/ProductPunctPaza.vue'
import './style.css'

// Single-route landing. vite-ssg prerenders it to static HTML for instant
// first paint + SEO; the 3D hero hydrates client-side only.
export const createApp = ViteSSG(
  App,
  {
    routes: [
      { path: '/', name: 'home', component: Home },
      { path: '/produs/punct-de-paza', name: 'punct-paza', component: ProductPunctPaza },
    ],
    scrollBehavior: (to) => (to.hash ? { el: to.hash, top: 80 } : { top: 0 }),
  },
  ({ isClient }) => {
    if (isClient) {
      // Signal to CSS that JS is live so reveal elements are managed by GSAP,
      // never left hidden if a script fails earlier.
      document.documentElement.classList.remove('no-js')
    }
  },
)

import { ViteSSG } from 'vite-ssg'
import { START_LOCATION } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import './style.css'

// Single-route landing. vite-ssg prerenders it to static HTML for instant
// first paint + SEO; the app hydrates after window load (see vite.config.ts) and the
// below-the-fold sections only when they approach the viewport (see Home.vue).
export const createApp = ViteSSG(App, {
  routes: [{ path: '/', name: 'home', component: Home }],
  scrollBehavior: (to, from) => {
    // Hydration runs after load: keep wherever the visitor already scrolled to.
    if (from === START_LOCATION) return false
    return to.hash ? { el: to.hash, top: 80 } : { top: 0 }
  },
})

import 'uno.css'
import './global.css'
import { mount } from 'svelte'
import App from './App.svelte'

// Clean up the service worker and cache left behind by older versions of the app.
navigator.serviceWorker?.getRegistrations().then((regs) => regs.forEach((reg) => reg.unregister()))
window.caches?.delete('main')
localStorage.removeItem('cacheAge')

const app = mount(App, {
	target: document.body,
})

export default app

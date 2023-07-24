import 'uno.css'
import './global.css'
import App from './App.svelte'
import { sendNotification } from './components/ts/notifications'
import { loadFont } from './font'
import { template } from './store'
import { loadTheme } from './theme'

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('./sw.js', { scope: './' })
		.then((reg) => {
			// registration worked
			console.log('Registration of Serviceworker succeeded.')

			reg.update()
		})
		.catch((error) => {
			// registration failed
			console.log('Registration of Serviceworker failed with ' + error)
		})

	navigator.serviceWorker.addEventListener('message', (event) => {
		switch (event.data.type) {
			case 'FONT FETCH FAILED':
				sendNotification({
					type: 'warning',
					content: `Coudn't fetch font. Defaulting to '${template.cosmetics.family}'...`,
				})
				loadFont(template.cosmetics.family)
				break
			case 'THEME FETCH FAILED':
				sendNotification({
					type: 'warning',
					content: `Coudn't fetch theme. Defaulting to '${template.cosmetics.theme.name}'...`,
				})
				loadTheme(template.cosmetics.theme.name)
				break
			case 'FETCH FAILED':
				sendNotification({
					type: 'warning',
					content: event.data.msg,
				})
				break
		}
	})
}

const app = new App({
	target: document.body,
})

export default app

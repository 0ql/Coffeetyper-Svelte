import { getFromLocalStorage, saveToLocalStorage } from './util'
import { template } from '../store'

const cacheFiles = () => {
	caches.open('main').then((cache) => {
		return cache.addAll([
			'./',
			'./manifest.json',
			'./static/1000.json',
			'./static/favicon.ico',
			'./static/icon.svg',
			'./static/fonts.json',
			'./assets/index.js',
			'./assets/chunk.js',
			'./assets/style.css',
			'./themes/_list.json',
			'./themes/bliss.css',
		])
	})
}

export const renewCache = async () => {
	console.log('Renewing cache...')
	saveToLocalStorage('cacheAge', Date.now())
	await caches.delete('main')
	cacheFiles()
	cacheCssFileAndFonts(template.cosmetics.family)
}

export const checkCacheAgeAndRenew = async () => {
	const age = getFromLocalStorage('cacheAge')

	if (age === null || !(await caches.has('main'))) {
		saveToLocalStorage('cacheAge', Date.now())
		cacheFiles()
		cacheCssFileAndFonts(template.cosmetics.family)
		return
	}

	// renew cache if older than a day
	if (age + 1000 * 60 * 60 * 24 < Date.now()) {
		renewCache()
	}
}

export const cacheCssFileAndFonts = async (family: string) => {
	console.log('Caching Font Family:', family)
	let req = new Request(`https://fonts.googleapis.com/css?family=${family}`)

	const res = await fetch(req)
	const copy = res.clone()

	caches.open('main').then((cache) => {
		cache.put(req, copy)
	})

	const txt = await res.text()

	let matches = txt.match(/\bhttps?:\/\/\S+/gi)

	matches = matches.map((match) => {
		if (match.at(match.length - 1) === ')') {
			return match.substring(0, match.length - 1)
		}
	})

	caches.open('main').then((cache) => {
		cache.addAll(matches)
	})
}

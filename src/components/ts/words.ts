import { get } from 'svelte/store'
import { settings } from '../../store'
import { sendNotification } from './notifications'

export const load1ktxtfile = async (): Promise<string[]> => {
  return (await fetch('/static/1000.json')).json()
}

export const wikipediaRandomPagePlainTextTopDesc = async (): Promise<string> => {
  const res = await fetch(`https://en.wikipedia.org/w/api.php?
		format=json&action=query&generator=random
		&grnnamespace=0&prop=extracts&exintro
		&explaintext&grnlimit=6&origin=*`)
  if (res.status !== 200) {
    sendNotification({
      type: 'error',
      content: 'Failed to get Wikipedia page.',
    })
		return
  }
  const jsn = await res.json()
	let str = ''
	let wordCount = 0
	Object.keys(jsn.query.pages).forEach(key => {
		if (wordCount < parseInt(get(settings).words) && jsn.query.pages[key].extract.length > 50) {
			wordCount += jsn.query.pages[key].extract.length
			str += jsn.query.pages[key].extract
		}
	})
	return str
}

const getRandomWordStrFromArr = (arr: string[], amount: number): string => {
	let str = ''
	for (let i = 0; i < amount; i++) {
		str += arr[Math.round(arr.length * Math.random())] + ' '
	}
	return str
}

export const createText = async (): Promise<string> => {
	const S = get(settings)
	const gen = S.gen
  let str = ''

	// first get initial text
	if (gen.set === 'preset') {
		switch (gen.preSet) {
			case 'top 1k':
				str = getRandomWordStrFromArr(await load1ktxtfile(), parseInt(S.words))
				break
		}
	} else if (gen.set === 'api') { switch (gen.preSet) {
			case 'wikipedia':
				str = await wikipediaRandomPagePlainTextTopDesc()
				break
		}
	} else if (gen.set === 'custom') {
		if (gen.customTxT.length < 1) {
			sendNotification({
				type: 'warning',
				content: "You must provide a custom text."
			})
			return
		}
		str = gen.customTxT
	}

	// apply filters
	if (gen.filters.blacklist.length > 0) {
		for (const subStr of gen.filters.blacklist) {
			str.replaceAll(subStr, '')
		}
	}
	if (gen.filters.whitelist.length > 0) { // only works with single chars
		for (const char of gen.filters.whitelist) {
			if (char.length !== 1) {
				sendNotification({
					type: 'error',
					content: 'Whitelist must only contain single characters.'
				})
				return null
			}
		}
	}

	switch (gen.filters.casing) {
		case 'default':
			break
		case 'lowercase':
			str = str.toLowerCase()
			break
		case 'uppercase':
			str = str.toUpperCase()
			break
		case 'random':
			let newStr = ''
			for (const char of str) {
				if (Math.random() > 0.5) newStr += char.toUpperCase()
				else newStr += char.toLowerCase()
			}
			str = newStr
			break
		case 'wordBeginning':
			str = str.split(' ').map((word) => {return word.charAt(0).toUpperCase() + word.slice(1, word.length)}).join(' ')
			break
	}
	
	return str
}


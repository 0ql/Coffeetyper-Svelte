import { refreshCosmetics, settings, template } from '../store'
import { get } from 'svelte/store'
import { getThemeList } from '../theme'
import { getFromLocalStorage, saveToLocalStorage } from '../util'

let fonts: string[]

export const getFonts = async (): Promise<string[]> => {
  if (!fonts) fonts = await (await fetch('./static/fonts.json')).json()
  return fonts
}

const randFloat = (min: number, max: number): number => {
  return min + Math.random() * (max - min)
}

const round = (num: number): number => {
  return Math.round(num)
}

export const randomizeSettings = async () => {
  const s = get(settings)
  const c = s.cosmetics

  let lineH = randFloat(1, 7)
  let letterSpacing = randFloat(0, 2)
  c.textBox.width = round(randFloat(30, 100)) + '%'
  c.textBox.lines = round(randFloat(1, 9)).toString()
  c.textBox.lineHeight = lineH.toFixed(1) + 'rem'
  c.textBox.letterSpacing = letterSpacing.toFixed(1) + 'rem'
  c.textBox.fontSize = randFloat(1, lineH).toFixed(1) + 'rem'
  c.textBox.spaceWidth = randFloat(letterSpacing, 5).toFixed(1) + 'rem'

  const fonts = await getFonts()
  const list = await getThemeList()
  c.theme.name = list[round(randFloat(0, list.length - 1))].name
  c.family = fonts[round(randFloat(0, fonts.length))]

  s.cosmetics = c
  refreshCosmetics()
  settings.set(s)
}

const cacheFiles = () => {
  caches.open('main').then((cache) => {
    return cache.addAll([
      './',
			'./manifest.json',
      './static/1000.json',
      './static/favicon.svg',
      './static/fonts.json',
      './assets/index.js',
      './assets/chunk.js',
      './assets/style.css',
      './themes/_list.json',
      './themes/bliss.css',
    ])
  })
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
    console.log('Renewing cache...')
    saveToLocalStorage('cacheAge', Date.now())
    await caches.delete('main')
    cacheFiles()
    cacheCssFileAndFonts(template.cosmetics.family)
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

export const saveCosmetics = (name: string) => {
  if (name.length < 1) {
    alert('Please enter a name')
    return
  }

  let c = getFromLocalStorage('savedCosmetics')
  if (c === null) c = {}

  c[name] = get(settings).cosmetics

  saveToLocalStorage('savedCosmetics', c)

  caches.open('main').then((cache) => {
    cache.add(`./themes/${get(settings).cosmetics.theme.name}.css`)
  })

  cacheCssFileAndFonts(get(settings).cosmetics.family)
}

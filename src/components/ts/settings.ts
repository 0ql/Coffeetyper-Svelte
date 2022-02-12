import { refreshCosmetics, settings } from '../../store'
import { get } from 'svelte/store'
import { getThemeList } from '../../theme'
import { getFromLocalStorage, saveToLocalStorage } from '../../lib/util'
import { cacheCssFileAndFonts } from '../../lib/cache'

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

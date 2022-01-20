import { refreshCosmetics, settings } from '../store'
import { get } from 'svelte/store'
import { getThemeList } from '../theme'

let fonts: any[] = []

export const getFonts = async (): Promise<any[]> => {
  if (fonts.length === 0) {
    const res = await fetch(
      'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC5aKFZzHKdeM8BuDGs5gXotGo2XJ8JsWs'
    )
    fonts = (await res.json())['items']
  }
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

  let list = await getThemeList()
  c.theme.name = list[round(randFloat(0, list.length - 1))].name
  c.family = fonts[round(randFloat(0, fonts.length))].family
	
	s.cosmetics = c
	refreshCosmetics()
	settings.set(s)
}

import { get, writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { loadFont } from './font'
import { loadTheme } from './theme'

export const fixBwithA = <T>(a: T, b: T): T => {
  for (const key of Object.keys(a !== null ? a : {})) {
    if (key in b === false) b[key] = a[key]
    if (typeof a[key] === 'object') fixBwithA(a[key], b[key])
  }
  return b
}

const loadSettingsFormLocalStorage = (): Writable<Settings> => {
  const res = localStorage.getItem('settings')
  if (res !== null) {
    let settings: Settings = JSON.parse(res)

    // check if settings are up to date
    settings = fixBwithA(template, settings)
    return writable(settings)
  } else {
    return writable(template)
  }
}

export type Modes = 'timed' | 'countdown' | 'countup'

export type Theme = {
  opened: boolean
  name: string
}

export type Settings = {
  opened: boolean
  wordSet: string
  modeName: Modes
  mode: {
    time: number
    words?: number
  }
  keybindings: {
    leader: {
      key: string
      pressed: boolean
    }
    reset: string
    toggleSettings: string
    toggleTheme: string
    randomizeSettings: string
  }
  cosmetics: {
    family: string
    theme: Theme
    textBox: {
      fontSize: string
      spaceWidth: string
      width: string
      lines: string
      words: string
      letterSpacing: string
      lineHeight: string
      caret: {
        duration: string
        width: string
        rounded: boolean
        colored: boolean
      }
      infobar: {
        liveWpm: boolean
        liveLpm: boolean
        liveTime: boolean
        liveAccuracy: boolean
      }
    }
    background: {
      bgImg: string
      opacity: string
    }
  }
}

export const template: Settings = {
  opened: false,
  wordSet: 'top 1k',
  modeName: 'countdown',
  mode: { time: 60, words: 30 },
  keybindings: {
    leader: {
      key: '\\',
      pressed: false,
    },
    reset: 'r',
    toggleSettings: 's',
    toggleTheme: 't',
    randomizeSettings: 'q',
  },
  cosmetics: {
    textBox: {
      width: '65%',
      lines: '3',
      words: '100',
      letterSpacing: '0.1rem',
      lineHeight: '4rem',
      caret: { duration: '150', width: '0.2rem', rounded: true, colored: true },
      infobar: {
        liveWpm: false,
        liveLpm: false,
        liveTime: true,
        liveAccuracy: false,
      },
      spaceWidth: '1.5rem',
      fontSize: '2.6rem',
    },
    background: {
      bgImg: '',
      opacity: '1',
    },
    theme: { opened: false, name: 'bliss' },
    family: 'Be Vietnam Pro',
  },
}

export const refreshCosmetics = () => {
	const s = get(settings)
	console.log(s)
	loadFont(s.cosmetics.family)
	loadTheme(s.cosmetics.theme.name)
}

export const settings: Writable<Settings> = loadSettingsFormLocalStorage()

let wait: number = 0

settings.subscribe((s) => {
  if (Date.now() - wait > 1000) {
    localStorage.setItem('settings', JSON.stringify(s))

    wait = Date.now()
  }
})

// contains all information regarding an active run
export const runState: Writable<{
  ended: boolean
  accuracy: number
  correctLetterCount: number
  correctWordCount: number
  progress: number
  timeString: string
  wpm: number
  lpm: number
  timePassed: number
}> = writable({
  ended: false,
  accuracy: 0,
  correctLetterCount: 0,
  correctWordCount: 0,
  progress: 0,
  timeString: '0:00',
  wpm: 0,
  lpm: 0,
  timePassed: 0,
})

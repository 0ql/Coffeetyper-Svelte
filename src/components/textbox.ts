import { runState, settings } from '../store'
import { get, writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
import type { Modes } from '../store'
import { formatTime } from '../util'
import { createText } from './words'
import { randomizeSettings } from './settings'

// === Timer stuff ===

let progress: number,
  running: boolean,
  passed: number = 0,
  timerInterval: NodeJS.Timer

export const startTimer = () => {
  let mode: Modes = get(settings).modeName
  let maxTime = get(settings).mode.time

  mode === 'countdown' ? (progress = maxTime) : null
  running = true

  runState.update((state) => {
    state.timeString = formatTime(progress)
    state.progress = progress
    state.timePassed = passed
    return state
  })

  timerInterval = setInterval(() => {
    if (running) {
      passed++
      mode === 'countdown' ? progress-- : null
      mode === 'countup' ? progress++ : null
      mode === 'timed' ? progress++ : null

      if (mode === 'countdown' && progress === 0) {
				runState.update((state) => {
					state.timeString = formatTime(progress)
					state.progress = progress
					state.timePassed = passed
					return state
				})
				endRun()
				return
			}

      if (
        (progress === 0 && mode === 'countdown') ||
        (progress == maxTime && mode === 'countup')
      ) {
        running = false

				runState.update((state) => {
					state.timeString = formatTime(progress)
					state.progress = progress
					state.timePassed = passed
					return state
				})
        endRun()
        return
      }

      runState.update((state) => {
        state.timeString = formatTime(progress)
        state.progress = progress
        state.timePassed = passed
        return state
      })
    }
  }, 1000)
}

const resetTimer = () => {
  running = false
  clearInterval(timerInterval)
  progress = 0
  passed = 0
}

// === Textbox Logic ===

export const letterHighlighting = (obj: any) => {
  if (obj.correct === true) {
    return 'color: var(--main-color)'
  } else if (obj.correct === false) {
    return 'color: var(--error-color)'
  }
}

const getOffset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  }
}

type TextArr = {
  letters: {
    active: boolean
    correct: boolean
    letter: string
  }[]
}[]

export const textArray: Writable<TextArr> = writable([])

let currentWord: number = 0,
  currentWordLetter: number = 0,
  currentLetter: number = 0

// autoscrolling
const onInterval = () => {
  const c = document.getElementById('#cursor')

  if (c) {
		const b = document.getElementById("#box")
    const infobar = document.getElementById('#infobar') as HTMLDivElement

    let innerHeight = window.innerHeight + infobar.clientHeight
    if (getOffset(c).top > innerHeight / 2) {
      b.scrollBy({
        top: c.clientHeight,
        behavior: 'smooth',
      })
    } else if (getOffset(c).top < innerHeight / 2 - c.clientHeight * 2) {
      b.scrollBy({
        top: -c.clientHeight,
        behavior: 'smooth',
      })
    }
  }
}

const updateRunStateStats = () => {
  textArray.update((ta: TextArr) => {
    let correctLetterCount = 0,
      correctWordCount = 0,
      progress = 0

    ta.forEach((word) => {
      word.letters.forEach((letter) => {
        if (letter.correct !== null) {
          letter.correct === true ? correctLetterCount++ : null
          progress++
        }
      })

      let falseLetterFlag = false
      word.letters.forEach((letter) => {
        if (!letter.correct) {
          falseLetterFlag = true
        }
      })

      if (!falseLetterFlag) {
        correctWordCount++
      }
    })

    runState.update((rs) => {
      rs.accuracy = progress !== 0 ? Math.round(correctLetterCount / progress * 100) : 0
      rs.progress = progress
      rs.correctLetterCount = correctLetterCount
      rs.correctWordCount = correctWordCount
			rs.wpm = Math.round(correctWordCount / (rs.timePassed / 60))
 			rs.wpm = isNaN(rs.wpm) ? 0 : rs.wpm
      return rs
    })

    return ta
  })
}

const handleKeyDown = async (e: KeyboardEvent) => {
  let s = get(settings)
  let k = s.keybindings

  // === Handle Shortcuts ===

  // if leader key was pressed return
  if (e.key === k.leader.key) {
    s.keybindings.leader.pressed = true
    settings.set(s)
    return
  }

  // leader is active
  if (s.keybindings.leader.pressed) {
    // toggle Settings
    if (e.key === k.toggleSettings) {
      s.opened = !s.opened
    }

    // reset Run
    if (e.key === k.reset) {
      resetRun()
    }

    // toggle Themeswitcher
		if (e.key === k.toggleTheme) {
			s.cosmetics.theme.opened = !s.cosmetics.theme.opened
		}

		if (e.key === k.randomizeSettings) {
			randomizeSettings()
		}

    s.keybindings.leader.pressed = false
		settings.set(s)
    return
  }

  // check if settings are opened
  if (s.opened) return

  // check if run ended
  if (get(runState).ended) return

  // === Handle special Keys ===

  const ta = get(textArray)

  // ctrl + backspace
  if (e.ctrlKey && e.key === 'Backspace') {
    if (currentWordLetter > 0) {
      ta[currentWord].letters[currentWordLetter].active = false
      currentLetter -= currentWordLetter + 1
      currentWordLetter = 0
      ta[currentWord].letters[currentWordLetter].active = true
    }
    updateRunStateStats()

    return
  } else if (e.ctrlKey) {
    return
  }

  // backspace
  if (e.key === 'Backspace') {
    if (currentWordLetter > 0) {
      ta[currentWord].letters[currentWordLetter].active = false
      currentLetter--
      currentWordLetter--
      ta[currentWord].letters[currentWordLetter].active = true
    }
    updateRunStateStats()
    return
  }

  // === Coloring of characters ===

  // correct letter?
  const letter = ta[currentWord].letters[currentWordLetter]
  if (letter.letter === e.key) {
    letter.correct = true
  } else {
    letter.correct = false
    if (letter.letter === ' ') {
      updateRunStateStats()
      return
    }
  }

  // update Array
  ta[currentWord].letters[currentWordLetter].active = false

  currentLetter++
  currentWordLetter++

  if (
    currentWord + 1 === ta.length - 1 &&
    currentWordLetter === ta[currentWord].letters.length
  ) {
    // no letters left
    endRun()
  }

  if (ta[currentWord].letters.length === currentWordLetter) {
    currentWord++
    currentWordLetter = 0
  }

  ta[currentWord].letters[currentWordLetter].active = true

  updateRunStateStats()

  settings.set(s)
}

let firstRun: boolean = true

export const startRun = async () => {
	if (firstRun) {
  	startEventListener()
		firstRun = false
	}
  await newText()
  startTimer()
}

// show statistics
const endRun = () => {
	updateRunStateStats()
  console.log('Run Ended...')
  runState.update((s) => {
    s.ended = true

    return s
  })
	// removeEventListener()
	resetTimer()
	console.log(get(runState))
}

// full reset
const resetRun = async () => {
  console.log('Reseting...')
  // removeEventListener()
  runState.set({
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

  currentWord = 0
  currentLetter = 0
  currentWordLetter = 0
  resetTimer()

  await startRun()
}

let autoScrollInterval: NodeJS.Timer

export const startEventListener = () => {
  autoScrollInterval = setInterval(onInterval, 200)
  document.addEventListener('keydown', handleKeyDown)
}

export const removeEventListener = () => {
  clearInterval(autoScrollInterval)
  document.removeEventListener('keydown', handleKeyDown)
}

const newText = async () => {
  let txt = await createText()
  textArray.set(
    txt.split(' ').map((word: string, i: number) => {
      const w = word.split('').map((letter, ii: number) => {
        return {
          letter: letter,
          correct: null,
          active: i === 0 && ii === 0 ? true : false,
        }
      })

      w.push({
        letter: ' ',
        correct: null,
        active: false,
      })

      return {
        letters: w,
      }
    })
  )
}

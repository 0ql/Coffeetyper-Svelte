import { runState, settings, textArray } from '../store'
import { get } from 'svelte/store'
import type { Modes, TextArr, RunState, WordT } from '../store'
import { formatTime } from '../util'
import { createText } from './words'
import { randomizeSettings } from './settings'
import { crossfade } from "svelte/transition";

// === Timer stuff ===

let progress: number = 0,
  running: boolean,
  passed = 0,
  timerInterval: NodeJS.Timer,
  mode: Modes,
  maxTime: number

const initTimer = () => {
  mode = get(settings).modeName
  maxTime = get(settings).mode.time

  mode === 'countdown' ? (progress = maxTime) : null

  runState.update((state) => {
    state.timeString = formatTime(progress)
    state.progress = progress
    state.timePassed = passed
    return state
  })
}

export const startTimer = () => {
  running = true

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

      updateRunStateStats()
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
    return 'color: var(--text-color)'
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

let currentWord = 0,
  currentWordLetter = 0,
  // used to mark the position of the cursor a second ago
  // this is used to calculate a more accurate value of the realtime aggWPM
  lastWord = 0,
  letterOfLastWord = 0

// autoscrolling
const onInterval = () => {
  const c = document.getElementById('#caret')

  if (c && get(runState).running) {
    const b = document.getElementById('#box')
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
      word.forEach((letter) => {
        if (letter.correct !== null) {
          letter.correct === true ? correctLetterCount++ : null
          progress++
        }
      })

      let falseLetterFlag = false
      word.forEach((letter) => {
        if (!letter.correct) {
          falseLetterFlag = true
        }
      })

      if (!falseLetterFlag) {
        correctWordCount++
      }
    })

    let correctLettersLastSecond = 0
    while (lastWord !== currentWord) {
      for (let i = letterOfLastWord; i < ta[lastWord].length; i++) {
        if (ta[lastWord][i].correct) {
          correctLettersLastSecond++
        }
      }
      letterOfLastWord = 0
      lastWord++
    }
    for (let i = letterOfLastWord; i < currentWordLetter; i++) {
      if (ta[lastWord][i].correct) {
        correctLettersLastSecond++
      }
    }

    runState.update((rs) => {
      rs.accuracy =
        progress !== 0 ? Math.round((correctLetterCount / progress) * 100) : 0
      rs.progress = progress
      rs.correctLetterCount = correctLetterCount
      rs.correctWordCount = correctWordCount

      // taking avarage length of words in english language (~5) to calculate live WPM
      rs.liveWPM = Math.round((correctLettersLastSecond / 5) * 60)
      rs.liveSPM = correctLettersLastSecond * 60
      return rs
    })

    return ta
  })

  lastWord = currentWord
  letterOfLastWord = currentWordLetter
}

let userTyped = false

const handleKeyDown = async (e: KeyboardEvent) => {
  let s = get(settings)
  let k = s.keybindings

  // === Handle Shortcuts ===

  // leader is active
  if (s.keybindings.leader.pressed) {
    e.preventDefault()
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

  // if leader key was pressed return
  if (e.key === k.leader.key) {
    e.preventDefault()
    s.keybindings.leader.pressed = true
    settings.set(s)
    return
  }

  // check if settings are opened
  if (s.opened) return

  // check if run ended
  if (get(runState).ended) return

  if (!userTyped) {
    startTimer()
    userTyped = true
    runState.update((r) => {
      r.running = true
      return r
    })
  }

  // === Handle special Keys ===

  const ta = get(textArray)

  // trigger rerender
  textArray.update((t) => t)

  // ctrl + backspace
  if (e.ctrlKey && e.key === 'Backspace') {
    if (currentWordLetter > 0) {
      ta[currentWord][currentWordLetter].active = false
      currentWordLetter = 0
      ta[currentWord][currentWordLetter].active = true
      ta[currentWord][currentWordLetter].correct = null

      ta[currentWord].forEach((letter) => {
        letter.correct = null
      })
    }

    return
  } else if (e.ctrlKey) {
    return
  }

  // backspace
  if (e.key === 'Backspace') {
    e.preventDefault() // prevents backspace from returning to previous page
    if (currentWordLetter > 0) {
      ta[currentWord][currentWordLetter].active = false
      currentWordLetter--
      ta[currentWord][currentWordLetter].active = true

      ta[currentWord][currentWordLetter].correct = null
    }
    return
  }

	if (e.key === 'Shift') return

  // === Coloring of characters ===

  // correct letter?
  const letter = ta[currentWord][currentWordLetter]
  if (letter.letter === e.key) {
    letter.correct = true
  } else {
    letter.correct = false
    if (letter.letter === ' ') {
      e.preventDefault()
      return
    }
  }

  // update Array
  ta[currentWord][currentWordLetter].active = false

  currentWordLetter++

  if (
    currentWord + 1 === ta.length - 1 &&
    currentWordLetter === ta[currentWord].length
  ) {
    // no letters left
    endRun()
		return
  }

  if (ta[currentWord].length === currentWordLetter) {
    currentWord++
    currentWordLetter = 0
  }

  ta[currentWord][currentWordLetter].active = true

  settings.set(s)
}

let firstRun: boolean = true

export const startRun = async () => {
  initTimer()
  if (firstRun) {
    startEventListener()
    firstRun = false
  }
  await newText()
}

// show statistics
const endRun = () => {
  runState.update((rs: RunState) => {
    rs.aggSPM = Math.round(rs.correctLetterCount / (rs.timePassed / 60))
    rs.aggWPM = Math.round(rs.aggSPM / 5)
    rs.aggWPM = isNaN(rs.aggWPM) || !isFinite(rs.aggWPM) ? 0 : rs.aggWPM
    rs.aggSPM = isNaN(rs.aggSPM) || !isFinite(rs.aggSPM) ? 0 : rs.aggSPM

    rs.trueWPM = Math.round(rs.correctWordCount / (rs.timePassed / 60))
    rs.trueSPM = Math.round(rs.correctLetterCount / (rs.timePassed / 60))
    rs.trueWPM = isNaN(rs.trueWPM) || !isFinite(rs.trueWPM) ? 0 : rs.trueWPM
    rs.trueSPM = isNaN(rs.trueSPM) || !isFinite(rs.trueSPM) ? 0 : rs.trueSPM

    rs.ended = true

    return rs
  })
  resetTimer()
  console.log(get(runState))
}

// full reset
const resetRun = async () => {
  userTyped = false
  runState.set({
    ended: false,
    running: false,
    accuracy: 0,
    correctLetterCount: 0,
    correctWordCount: 0,
    progress: 0,
    timeString: '0:00',
    aggWPM: 0,
    liveWPM: 0,
    trueWPM: 0,
    aggSPM: 0,
    liveSPM: 0,
    trueSPM: 0,
    timePassed: 0,
    overTime: [],
  })

  currentWord = 0
  currentWordLetter = 0
  lastWord = 0
  letterOfLastWord = 0
  resetTimer()
	

  await startRun()

	document.getElementById("#box").scrollTo({
		top: 0,
		behavior: 'smooth'
	})
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
    txt.split(' ').map((word: string, i: number): WordT => {
      const w: WordT = word.split('').map((letter, ii: number) => {
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

      return w
    })
  )
}

export const [send, receive] = crossfade({
  duration: parseInt(get(settings).cosmetics.textBox.caret.duration),
})

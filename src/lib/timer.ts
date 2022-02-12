import { runState, settings } from '../store'
import { get } from 'svelte/store'
import { formatTime } from './util'
import type { Modes } from '../store'
import { endRun, updateRunStateStats } from '../components/ts/textbox'

let progress: number = 0,
  running: boolean,
  passed = 0,
  timerInterval: NodeJS.Timer,
  mode: Modes,
  maxTime: number

export const initTimer = () => {
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

export const resetTimer = () => {
  running = false
  clearInterval(timerInterval)
  progress = 0
  passed = 0
}

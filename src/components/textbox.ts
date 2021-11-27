import { runState } from "../store";
import { get, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { Modes } from "../store";
import { formatTime } from "../util";

export class Timer {
  public progress: number;
  private interval: any;
  public timeString: string;
  public running: boolean;

  constructor() {
    this.progress = 0;
    this.timeString = "0:00";
    this.running = false;
  }

  public start(mode: Modes, maxTime: number, done: () => void) {
    mode === "countdown" ? (this.progress = maxTime) : null;
    this.running = true;

    runState.update((state) => {
      state.timeString = formatTime(this.progress);
      state.progress = this.progress;
      return state;
    });

    this.interval = setInterval(() => {
      if (this.running) {
        mode === "countdown" ? this.progress-- : null;
        mode === "countup" ? this.progress++ : null;
        mode === "timed" ? this.progress++ : null;

        if (mode === "countdown" && this.progress === 0) {
          this.reset();
        }

        if (
          (this.progress === 0 && mode === "countdown") ||
          (this.progress == maxTime && mode === "countup")
        ) {
          this.running = false;
          done();
        }

        runState.update((state) => {
          state.timeString = formatTime(this.progress);
          state.progress = this.progress;
          return state;
        });
      }
    }, 1000);
  }

  public pause() {
    this.running = false;
  }

  public reset() {
    this.running = false;
    clearInterval(this.interval);
    this.progress = 0;
  }
}

export const letterHighlighting = (obj: any) => {
  if (obj.correct === true) {
    return "color: var(--main-color)";
  } else if (obj.correct === false) {
    return "color: var(--error-color)";
  }
};

const getOffset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  };
};

type TextArr = {
  letters: {
    active: boolean;
    correct: boolean;
    letter: string;
  }[];
}[];

export const textArray: Writable<TextArr> = writable([]);

export class RunManager {
  cursor: Writable<HTMLDivElement>;
  infobar: HTMLDivElement;
  box: HTMLDivElement;
  interval: NodeJS.Timer;
  currentLetter: number;
  currentWord: number;
  currentWordLetter: number;
  ended: boolean;
  userInput: () => void;
  onRunEnded: () => void;

  constructor(
    infobar: HTMLDivElement,
    box: HTMLDivElement,
    cursor: Writable<HTMLDivElement>,
    userInput: () => void,
    onRunEnded: () => void
  ) {
    this.userInput = userInput;
    this.cursor = cursor;
    this.infobar = infobar;
    this.box = box;
    this.currentLetter = 0;
    this.currentWord = 0;
    this.currentWordLetter = 0;
    this.onRunEnded = onRunEnded;
    this.ended = false;
  }

  private onInterval = () => {
    const c = get(this.cursor);
    if (c) {
      let innerHeight = window.innerHeight + this.infobar.clientHeight;
      if (getOffset(c).top > innerHeight / 2) {
        this.box.scrollBy({
          top: c.clientHeight,
          behavior: "smooth",
        });
      } else if (getOffset(c).top < innerHeight / 2 - c.clientHeight * 2) {
        this.box.scrollBy({
          top: -c.clientHeight,
          behavior: "smooth",
        });
      }
    }
  };

  private calculateStatistics() {
    textArray.update((ta: TextArr) => {
      let correctLetterCount = 0,
        correctWordCount = 0,
        progress = 0;

      ta.forEach((word) => {
        // calculate progress and accuracy
        word.letters.forEach((letter) => {
          if (letter.correct !== null) {
            letter.correct === true ? correctLetterCount++ : null;
            progress++;
          }
        });

        // calculate words per minute
        let falseLetterFlag = false;
        word.letters.forEach((letter) => {
          if (!letter.correct) {
            falseLetterFlag = true;
          }
        });

        if (!falseLetterFlag) {
          correctWordCount++;
        }
      });

      runState.update((state) => {
        state.accuracy = progress !== 0 ? correctLetterCount / progress : 0;
        state.progress = progress;
        state.correctLetterCount = correctLetterCount;
        state.correctWordCount = correctWordCount;
        return state;
      });

      return ta;
    });
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const ta = get(textArray);
    if (e.key === "Backspace" && this.currentWordLetter > 0) {
      ta[this.currentWord].letters[this.currentWordLetter].active = false;
      this.currentLetter--;
      this.currentWordLetter--;
      ta[this.currentWord].letters[this.currentWordLetter].active = true;
    }

    this.calculateStatistics();
  };

  private handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "R") return;
    if (this.ended) return;
    const ta = get(textArray);

    const letter = ta[this.currentWord].letters[this.currentWordLetter];

    if (letter.letter === e.key) {
      letter.correct = true;
    } else {
      letter.correct = false;
      if (letter.letter === " ") {
        return;
      }
    }

    ta[this.currentWord].letters[this.currentWordLetter].active = false;

    this.currentLetter++;
    this.currentWordLetter++;

    if (
      this.currentWord + 1 === ta.length - 1 &&
      this.currentWordLetter === ta[this.currentWord].letters.length
    ) {
      this.onRunEnded();
      this.ended = true;
    }

    if (ta[this.currentWord].letters.length === this.currentWordLetter) {
      this.currentWord++;
      this.currentWordLetter = 0;
    }

    ta[this.currentWord].letters[this.currentWordLetter].active = true;

    this.userInput();
    this.calculateStatistics();
  };

  public reset() {
    this.ended = false;
    this.currentLetter = 0;
    this.currentWord = 0;
    this.currentWordLetter = 0;
  }

  public startEventListeners() {
    this.interval = setInterval(this.onInterval, 200);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keypress", this.handleKeyPress);
  }

  public removeEventListeners() {
    clearInterval(this.interval);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keypress", this.handleKeyPress);
  }
}

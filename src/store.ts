import { get, writable } from "svelte/store";
import { loadFont } from "./font";
import { loadTheme } from "./theme";
import type { Writable } from "svelte/store";
import { getFromLocalStorage, saveToLocalStorage } from "./util";

const fixBwithA = <T>(a: T, b: T): T => {
  for (const key of Object.keys(a !== null ? a : {})) {
    if (key in b === false) b[key] = a[key];
    if (typeof a[key] === "object") fixBwithA(a[key], b[key]);
  }
  return b;
};

const loadSettingsFormLocalStorage = (): Writable<Settings> => {
  const res = localStorage.getItem("settings");
  if (res !== null) {
    let settings: Settings = JSON.parse(res);

    // check if settings are up to date
    settings = fixBwithA(template, settings);
    return writable(settings);
  } else {
    return writable(template);
  }
};

const fixStorage = () => {
  localStorage.removeItem("theme");
  let s: { [key: string]: Settings } = getFromLocalStorage("savedSettings");
  for (let key in s) {
    if (s[key]["font"]) {
      delete s[key]["font"];
    }
    if (s[key].theme["themeList"]) {
      delete s[key].theme["themeList"];
    }
  }
  saveToLocalStorage("savedSettings", s);
};

export type Modes = "timed" | "countdown" | "countup";

export type Theme = {
  opened: boolean;
  active: string;
};

export type Settings = {
  opened: boolean;
  family: string;
  wordSet: string;
  modeName: Modes;
  mode: {
    time: number;
    words?: number;
  };
  theme: Theme;
  textBox: {
    fontSize: string;
    spaceWidth: string;
    width: string;
    lines: string;
    words: string;
    letterSpacing: string;
    lineHeight: string;
    caret: {
      duration: string;
      width: string;
      rounded: boolean;
    };
    infobar: {
      liveWpm: boolean;
      liveLpm: boolean;
      liveTime: boolean;
      liveAccuracy: boolean;
    };
  };
};

const template: Settings = {
  opened: false,
  family: "Poppins",
  theme: {
    opened: false,
    active: "rgb",
  },
  wordSet: "top 1k",
  modeName: "countdown",
  mode: {
    time: 30,
    words: 30,
  },
  textBox: {
    spaceWidth: "0.5rem",
    fontSize: "1rem",
    width: "80%",
    lines: "3",
    words: "100",
    letterSpacing: "0.1rem",
    lineHeight: "3rem",
    caret: {
      duration: "150",
      width: "0.2rem",
      rounded: true,
    },
    infobar: {
      liveWpm: false,
      liveLpm: false,
      liveTime: true,
      liveAccuracy: true,
    },
  },
};

export const settings: Writable<Settings> = loadSettingsFormLocalStorage();
fixStorage();

let recentFont: string = "",
  recentTheme: string = "",
  wait: number = 0;

settings.subscribe((s) => {
  if (Date.now() - wait > 500) {
    if (s && recentFont !== s.family) {
      console.log("Loading font:", s.family);
      loadFont(s.family);
      document.body.style.fontFamily = s.family;
      recentFont = s.family;
    }

    if (s.theme.active !== recentTheme) {
      loadTheme(get(settings).theme.active);
      recentTheme = s.theme.active;
    }

    wait = Date.now();

    localStorage.setItem("settings", JSON.stringify(s));
  }
});

const loadSavedSettings = (): { [key: string]: Settings } => {
  const res = localStorage.getItem("savedSettings");
  if (res !== null) {
    const settings = JSON.parse(res);
    return settings;
  } else {
    return {};
  }
};

export const runState: Writable<{
  accuracy: number;
  correctLetterCount: number;
  correctWordCount: number;
  progress: number;
  timeString: string;
  wpm: number;
  lpm: number;
  timePassed: number;
}> = writable({
  accuracy: 0,
  correctLetterCount: 0,
  correctWordCount: 0,
  progress: 0,
  timeString: "0:00",
  wpm: 0,
  lpm: 0,
  timePassed: 0,
});

export const cursor: Writable<HTMLDivElement> = writable(null);
export const box: Writable<HTMLDivElement> = writable(null);

export const savedSettings: Writable<{ [key: string]: Settings }> = writable(
  loadSavedSettings()
);

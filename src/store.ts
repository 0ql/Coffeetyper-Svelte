import { get, writable } from "svelte/store";
import { loadFont } from "./font";
import { loadTheme } from "./theme";
import type { Font } from "./font";
import type { Writable } from "svelte/store";
import type { themeList } from "./theme";

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
};

export type Modes = "timed" | "countdown" | "countup";

export type Theme = {
  opened: boolean;
  active: string;
  themeList: themeList;
};

export type Settings = {
  opened: boolean;
  font: Font;
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
  font: {
    family: "Poppins",
    variants: ["regular"],
    subsets: ["devanagari", "latin", "latin-ext"],
    version: "v15",
    lastModified: "2020-11-06",
    files: {
      regular:
        "http://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf",
    },
    category: "sans-serif",
    kind: "webfonts#webfont",
  },
  theme: {
    opened: false,
    active: "rgb",
    themeList: null,
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
    if (s.font && recentFont !== s.font.family) {
      console.log("Loading font:", s.font.family);
      loadFont(s.font.family);
      document.body.style.fontFamily = s.font.family;
      recentFont = s.font.family;
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
}> = writable({
  accuracy: 0,
  correctLetterCount: 0,
  correctWordCount: 0,
  progress: 0,
  timeString: "0:00",
});

export const cursor: Writable<HTMLDivElement> = writable(null);
export const box: Writable<HTMLDivElement> = writable(null);

export const savedSettings: Writable<{ [key: string]: Settings }> = writable(
  loadSavedSettings()
);

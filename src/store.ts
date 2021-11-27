import { writable } from "svelte/store";
import { loadTheme } from "./theme";
import { loadFont } from "./font";
import type { Font } from "./font";
import type { Writable } from "svelte/store";
import type { themeList } from "./theme";

export type Modes = "timed" | "countdown" | "countup";

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
  wordSet: "top 1k",
  modeName: "countdown",
  mode: {
    time: 30,
    words: 30,
  },
  textBox: {
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

const fixBwithA = <T>(a: T, b: T): T => {
  for (const key of Object.keys(a)) {
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

export type Settings = {
  opened: boolean;
  font: Font;
  wordSet: string;
  modeName: Modes;
  mode: {
    time: number;
    words?: number;
  };
  textBox: {
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

export const settings: Writable<Settings> = loadSettingsFormLocalStorage();

let recentFont: string = "";
let wait: number = 0;

settings.subscribe((s) => {
  if (Date.now() - wait > 500) {
    if (s.font && recentFont !== s.font.family) {
      console.log("Loading font:", s.font.family);
      loadFont(s.font.family);
      document.body.style.fontFamily = s.font.family;
      recentFont = s.font.family;
    }

    document.documentElement.style.setProperty(
      "--text-box-width",
      `${s.textBox.width}`
    );

    wait = Date.now();

    localStorage.setItem("settings", JSON.stringify(s));
  }
});

export type Theme = {
  opened: boolean;
  active: string;
  themeList: themeList;
};

const loadThemeFormLocalStorage = (): Writable<Theme> => {
  const res = localStorage.getItem("theme");
  if (res !== null) {
    const theme = JSON.parse(res);
    return writable(theme);
  } else {
    return writable({
      opened: false,
      active: "rgb",
      themeList: null,
    });
  }
};

export const theme: Writable<Theme> = loadThemeFormLocalStorage();

let recentTheme: string = "";

theme.subscribe((t) => {
  if (t.active !== recentTheme) {
    loadTheme(t.active);
    recentTheme = t.active;
  }

  localStorage.setItem("theme", JSON.stringify(t));
});

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

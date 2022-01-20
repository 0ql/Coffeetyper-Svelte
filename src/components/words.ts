import {get} from "svelte/store";
import {settings} from "../store";

export const load1ktxtfile = async (): Promise<string[]> => {
  const cache = localStorage.getItem("1kfile");
  if (cache !== null) {
    return JSON.parse(cache);
  } else {
    const res = await fetch("/static/1000.json");
    const array: string[] = await res.json();
    localStorage.setItem("1kfile", JSON.stringify(array));
    return array;
  }
};

export const createText = async (): Promise<string> => {
  const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  // const num = ["0","1","2","3","4","5","6","7","8","9"]
  let str = "";
  switch (get(settings).wordSet) {
    case "top 1k":
      const array = await load1ktxtfile();
      for (let i = 0; i < parseInt(get(settings).cosmetics.textBox.words); i++) {
        let rd = Math.round(array.length * Math.random());
        str += array[rd] + " ";
      }
      return str;
    case "randomAlpha":
      for (let i = 0; i < parseInt(get(settings).cosmetics.textBox.words); i++) {
        let len = Math.round(Math.random() * 7)
        let word: string = ""
        for (let i = 0; i < len; i++) {
          let char = alpha[Math.round(Math.random() * (alpha.length - 1))]
          word += char
        }
        str += word + " ";
      }
      return str;
    case "randomAlphaNum":
      for (let i = 0; i < parseInt(get(settings).cosmetics.textBox.words); i++) {
        let len = Math.round(Math.random() * 7)
        let word: string = ""
        if (Math.random() > 0.7) {
          str += Math.round(Math.random() * 10000)
        } else {
          for (let i = 0; i < len; i++) {
            let char = alpha[Math.round(Math.random() * (alpha.length - 1))]
            word += char
          }
        }
        str += word + " ";
      }
      return str;
  }
};

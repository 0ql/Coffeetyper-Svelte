import { get } from "svelte/store";
import { settings } from "../store";

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
  if (get(settings).wordSet === "top 1k") {
    const array = await load1ktxtfile();
    let str = "";
    let rd: number;
    for (let i = 0; i < parseInt(get(settings).textBox.words); i++) {
      rd = Math.round(array.length * Math.random());
      str += array[rd] + " ";
    }
    return str;
  }
};

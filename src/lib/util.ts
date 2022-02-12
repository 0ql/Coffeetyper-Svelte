export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const getFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);
  if (typeof item === "string") {
    return JSON.parse(item);
  }
  return null;
};

export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const remToPx = (rem: number): number => {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

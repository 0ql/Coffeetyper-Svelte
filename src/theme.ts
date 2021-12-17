export type themeList = {
  name: string;
  bgColor: string;
  textColor: string;
}[];

export const loadTheme = (resource: string) => {
  console.log("Loading Theme:", resource);

  let link = document.createElement("link");
  link.href = "/themes/" + resource + ".css";
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";

  document.getElementById("linkContainer").innerHTML = link.outerHTML;
};

let themeListChache: themeList[]

export const getThemeList = async (): Promise<themeList> => {
  if (!themeListChache) themeListChache = await fetch("/themes/_list.json").then((res) => res.json());
  return themeListChache
};

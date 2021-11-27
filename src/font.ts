export type Font = {
  category: string;
  family: string;
  files: {
    italic?: string;
    regular?: string;
  };
  kind: string;
  variants: string[];
  [key: string]: any;
};

export const loadFont = async (family: string) => {
  let link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css?family=" + family;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";

  document.getElementById("fontContainer").innerHTML += link.outerHTML;
};

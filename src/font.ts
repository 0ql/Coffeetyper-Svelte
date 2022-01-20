export const loadFont = async (family: string) => {
	console.log('Loading font:', family)

  let link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css?family=" + family;
  link.type = "text/css";
  link.rel = "stylesheet";
  link.media = "screen,print";

  document.getElementById("fontContainer").innerHTML += link.outerHTML;
	document.body.style.fontFamily = family
};

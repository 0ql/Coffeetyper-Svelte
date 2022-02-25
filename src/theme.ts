export type themeList = {
  name: string
  bgColor: string
  textColor: string
}[]

export const loadTheme = (resource: string) => {
  console.log('Loading Theme:', resource)

  let link = document.createElement('link')
  link.href = '/themes/' + resource + '.css'
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.media = 'screen,print'

  document.getElementById('linkContainer').innerHTML = link.outerHTML
}

export const getThemeList = async (): Promise<themeList> => {
  return (await fetch('/themes/_list.json')).json()
}

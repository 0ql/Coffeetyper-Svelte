<p align="center">
  <img src="https://raw.githubusercontent.com/0ql/Coffeetyper-Svelte/master/public/static/icon.svg" width="140" alt="Coffeetyper logo" />
</p>

<h1 align="center">Coffeetyper</h1>

<p align="center">
  A minimalist, lightweight and ultra customizable typing test, inspired by <a href="https://monkeytype.com">Monkeytype</a>.
</p>

<p align="center">
  <a href="https://coffeetyper.com"><strong>coffeetyper.com</strong></a>
  ·
  <a href="https://github.com/0ql/Coffeetyper-Svelte/issues">Report a bug</a>
  ·
  <a href="LICENSE.md">GPL-3.0</a>
</p>

<p align="center">
  <img src="https://i.imgur.com/db2T4DA.png" alt="Coffeetyper typing test" width="80%" />
</p>

## Features

- ⚡ **Fast**: a tiny bundle that loads instantly
- 🎨 **Themes**: switch color schemes in real time
- 🔤 **Any font**: pick from every font on [Google Fonts](https://fonts.google.com)
- 🛠️ **Customize everything**: textbox width, letter spacing, line height, caret style, background image and more
- 💾 **Cosmetic presets**: save, switch between, import and export your looks as JSON
- 🎲 **Randomize**: generate a random look (with very interesting results)
- ⌨️ **Keybindings**: drive everything from the keyboard
- 🔄 **Live settings**: every change applies instantly and is saved in local storage

## Usage

Move your mouse to the **left edge** of the screen to open the settings, and to the **right edge** to open the theme switcher.

<p align="center">
  <img src="https://i.imgur.com/PpnKinI.png" alt="Settings panel" width="45%" />
  &nbsp;
  <img src="https://i.imgur.com/CVHuT6F.png" alt="Theme switcher" width="45%" />
</p>

### Keybindings

Press the leader key, then a command key. Every binding can be changed in the settings.

| Shortcut  | Action                 |
| --------- | ---------------------- |
| `Tab` `r` | Restart the test       |
| `Tab` `s` | Toggle settings        |
| `Tab` `t` | Toggle theme switcher  |
| `Tab` `q` | Randomize the look     |

### How WPM is calculated

WPM counts the correctly typed characters per minute and divides by 5, the average length of an English word. SPM (symbols per minute) is the same count without the division.

## Gallery

<p align="center">
  <img src="https://i.imgur.com/az53ftv.png" alt="Customized Coffeetyper" width="45%" />
  &nbsp;
  <img src="https://i.imgur.com/JvtXpVq.png" alt="Customized Coffeetyper" width="45%" />
</p>

## Development

Built with [Svelte 5](https://svelte.dev), TypeScript, [Vite](https://vite.dev) and [UnoCSS](https://unocss.dev).

```sh
pnpm install
pnpm dev      # dev server on http://localhost:3000
pnpm build    # production build in dist/
pnpm serve    # preview the production build
pnpm check    # type-check
```

## Contributing

Coffeetyper isn't as feature-rich as Monkeytype yet, but it covers the essentials of a typing test. Pull requests are always welcome.

## Credits

Color schemes are from [Monkeytype](https://github.com/monkeytypegame/monkeytype).

## License

[GPL-3.0](LICENSE.md)

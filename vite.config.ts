import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import Unocss from "unocss/vite"
import { presetIcons, presetWind3 } from "unocss"
import { presetScrollbar } from "unocss-preset-scrollbar"
import extractorSvelte from "@unocss/extractor-svelte"

export default defineConfig({
	plugins: [svelte(), Unocss({
		extractors: [extractorSvelte()],
		presets: [presetWind3(), presetIcons(), presetScrollbar()]
	})],
})

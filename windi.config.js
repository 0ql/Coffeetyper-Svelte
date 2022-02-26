import pluginAnimations from '@windicss/plugin-animations'
import pluginScroll from '@windicss/plugin-scrollbar'
export default {
	plugins: [pluginAnimations, pluginScroll],
	extract: {
		include: ['src/**/*.{html,vue,jsx,tsx,svelte}'],
	},
}

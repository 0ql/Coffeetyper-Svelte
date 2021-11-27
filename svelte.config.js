import sveltePreprocess from "svelte-preprocess";
import * as sass from "sass";

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    sveltePreprocess({
      postcss: true,
      sass: {
        sync: true,
        implementation: sass,
      },
    }),
  ],
};

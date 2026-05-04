// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here must be inside an object
  {
    rules: {
      'vue/first-attribute-linebreak': 'off'
    }
  }
)

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
          siteBg:"rgb(var(--bg-color) / <alpha-value>)",
          objectBg:"rgb(var(--object-bg-color) / <alpha-value>)",
          mainTextColor:"rgb(var(--main-text-color) / <alpha-value>)",

      }
    },
  },
  safelist: [
    {
        pattern: /bg-+/,
    },
  ],
  darkMode: ["class"],
  plugins: [
    require('@tailwindcss/forms'),
  ],
  mode:'jit',
     // These paths are just examples, customize them to match your project structure
     purge: [
      './public/**/*.html',
      './src/**/*.{js,jsx,ts,tsx,vue}',
    ],
}
export default config

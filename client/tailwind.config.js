const flowbite = require('flowbite-react/tailwind')

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		flowbite.content()
	],
	theme: {
		extend: {
			
			animation: {
				shine: 'shine 1s'
			},
			keyframes: {
				shine: {
					'100%': { left: '125%' }
				}
			}
			
		}
	},
	plugins: [
		flowbite.plugin(),
		require('tailwind-scrollbar')
	]
}
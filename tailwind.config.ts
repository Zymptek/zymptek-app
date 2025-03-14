import type { Config } from "tailwindcss"

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				'100': 'var(--brand-100)',
  				'200': 'var(--brand-200)',
  				'300': 'var(--brand-300)',
  				'400': 'var(--brand-400)',
  				'500': 'var(--brand-500)'
  			},
  			accent: {
  				'100': 'var(--accent-100)'
  			},
  			background: {
  				light: 'var(--background-light)',
  			},
  			text: {
  				light: 'var(--text-light)',
  			},
  			border: {
  				light: 'var(--border-light)',
  			},
  			hoverBg: {
  				light: 'var(--hover-bg-light)',
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: 'var(--font-heading)',
  			subheading: 'var(--font-subheading)',
  			body: 'var(--font-body)'
  		},
  		borderRadius: {
  			lg: '8px'
  		},
  		backgroundImage: {
  			'gradient-brand': 'linear-gradient(90deg, var(--brand-200), var(--brand-300))',
  			'gradient-accent': 'linear-gradient(90deg, var(--brand-400), var(--brand-500))'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
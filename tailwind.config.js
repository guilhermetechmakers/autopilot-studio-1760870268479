/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'rgb(var(--primary))',
  				foreground: 'rgb(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'rgb(var(--secondary))',
  				foreground: 'rgb(var(--secondary-foreground))'
  			},
  			accent: {
  				yellow: 'rgb(var(--accent-yellow))',
  				green: 'rgb(var(--accent-green))',
  				blue: 'rgb(var(--accent-blue))',
  				red: 'rgb(var(--accent-red))',
  				purple: 'rgb(var(--accent-purple))'
  			},
  			background: 'rgb(var(--background))',
  			foreground: 'rgb(var(--foreground))',
  			card: {
  				DEFAULT: 'rgb(var(--card))',
  				foreground: 'rgb(var(--card-foreground))'
  			},
  			sidebar: 'rgb(var(--sidebar))',
  			border: 'rgb(var(--border))',
  			input: 'rgb(var(--input))',
  			ring: 'rgb(var(--ring))',
  			muted: {
  				DEFAULT: 'rgb(var(--muted))',
  				foreground: 'rgb(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'rgb(var(--destructive))',
  				foreground: 'rgb(var(--destructive-foreground))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.4s ease-out',
  			'fade-in-up': 'fadeInUp 0.4s ease-out',
  			'fade-in-down': 'fadeInDown 0.4s ease-out',
  			'slide-in-left': 'slideInLeft 0.3s ease-out',
  			'slide-in-right': 'slideInRight 0.3s ease-out',
  			'scale-in': 'scaleIn 0.2s ease-out',
  			'bounce-in': 'bounceIn 0.6s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			fadeInUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			fadeInDown: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideInLeft: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			bounceIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.3)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
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
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}

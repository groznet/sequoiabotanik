module.exports = {
    theme: {
        extend: {
            colors: {
                primary: '#1F3D2B',
                'primary-light': '#2A5538',
                'primary-dark': '#152920',
                secondary: '#4C7A5A',
                'secondary-light': '#5E916D',
                accent: '#D6A85A',
                'accent-light': '#E0BC7A',
                'accent-dark': '#C4963D',
                background: '#F7F9F5',
                surface: '#FFFFFF',
                text: '#1A1A1A',
                muted: '#7A807A',
                'muted-light': '#A5AAA5',
                'border-soft': '#E5E8E3',
            },
            fontFamily: {
                heading: ['Playfair Display', 'serif'],
                body: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                sm: '0.25rem',
                md: '0.5rem',
                lg: '1rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                full: '9999px',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'fade-in-down': 'fadeInDown 0.35s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'slide-out-right': 'slideOutRight 0.35s ease-in',
                'scale-in': 'scaleIn 0.3s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': {
                        opacity: '0'
                    },
                    '100%': {
                        opacity: '1'
                    },
                },
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                },
                fadeInDown: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-12px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                },
                slideInRight: {
                    '0%': {
                        transform: 'translateX(100%)'
                    },
                    '100%': {
                        transform: 'translateX(0)'
                    },
                },
                slideOutRight: {
                    '0%': {
                        transform: 'translateX(0)'
                    },
                    '100%': {
                        transform: 'translateX(100%)'
                    },
                },
                scaleIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.95)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1)'
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-16px)'
                    },
                },
                pulseSubtle: {
                    '0%, 100%': {
                        opacity: '1'
                    },
                    '50%': {
                        opacity: '0.75'
                    },
                },
            },
            screens: {
                'xs': '480px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
            },
        },
    },
};
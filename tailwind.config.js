/** @type {import('tailwindcss').Config} */
export default { content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'], theme:{extend:{fontFamily:{sans:['Inter','sans-serif']},colors:{navy:{900:'var(--color-primary-navy)',800:'var(--color-secondary-navy)',700:'#1E3A5F'},brand:'var(--color-primary-blue)'},boxShadow:{card:'var(--shadow-card)',premium:'var(--shadow-card-hover)'}}}, plugins:[] }

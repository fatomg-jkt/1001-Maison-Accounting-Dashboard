import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme:{extend:{fontFamily:{sans:['Public Sans','sans-serif'],serif:['Playfair Display','serif']},colors:{navy:{900:'var(--color-primary-navy)',800:'var(--color-secondary-navy)',700:'#1E3A5F'},brand:'var(--color-primary-blue)'},boxShadow:{card:'var(--shadow-card)',premium:'var(--shadow-card-hover)'}}},
  plugins:[
    plugin(({addComponents})=>{
      addComponents({
        'aside > div:first-child > div:nth-child(2)':{
          width:'auto !important',
          height:'40px !important',
          display:'flex !important',
          alignItems:'center !important',
          justifyContent:'flex-start !important',
          gap:'9px !important',
          flex:'1 1 auto !important',
          minWidth:'0 !important',
          marginLeft:'8px !important'
        },
        'aside > div:first-child > div:nth-child(2)::after':{
          content:'"1001 & Maison\\A Accounting"',
          display:'block',
          whiteSpace:'pre-line',
          color:'#FFF7EA',
          fontSize:'11px',
          lineHeight:'1.25',
          fontWeight:'600',
          letterSpacing:'.02em',
          flex:'0 1 auto'
        }
      })
    })
  ]
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: {
      paper:'#fbfcff', ink:'#111827', navy:{900:'#0f172a',800:'#172033',700:'#26324a'},
      indigo:{q:'#1e568a'}, violet:{q:'#1e568a', q2:'#2b6da3'}, navyq:{DEFAULT:'#1e568a'}, cyan:{q:'#2b6da3'}, line:'#dbe1ea', mute:'#64748b'
    },
    fontFamily:{display:['"Sora Variable"','system-ui','sans-serif'],sans:['"Instrument Sans Variable"','system-ui','sans-serif']},
    boxShadow:{lift:'0 24px 80px -36px rgba(30,86,138,.18)',quantum:'0 25px 70px -42px rgba(31,41,78,.35)'}
  }}, plugins:[]
};

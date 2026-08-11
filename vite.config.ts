import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const publicFinancialReports=()=>({
  name:'public-financial-reports',
  enforce:'pre' as const,
  transform(code:string,id:string){
    if(!id.endsWith('/src/main.tsx'))return null
    const protectedReport=/function ProtectedFinancialReport\(\{type\}:\{type:'balance'\|'income'\}\)\{[\s\S]*?\}\n\nconst rootRoute=/
    if(!protectedReport.test(code))return null
    return {code:code.replace(protectedReport,"function ProtectedFinancialReport({type}:{type:'balance'|'income'}){return <Report type={type}/>}\n\nconst rootRoute="),map:null}
  },
})

export default defineConfig(({mode})=>{
  const env=loadEnv(mode,'.','')
  return {
    plugins:[publicFinancialReports(),react()],
    define:{__OWNER_EMAIL__:JSON.stringify(env.OWNER_EMAIL??'')},
  }
})

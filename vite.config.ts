import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({mode})=>{
  const env=loadEnv(mode,'.','')
  return {
    plugins:[react()],
    define:{__OWNER_EMAIL__:JSON.stringify(env.OWNER_EMAIL??'')},
  }
})

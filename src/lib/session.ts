import type {SessionUser} from './financial-access'

const publicReportUser:SessionUser={id:'public-financial-reports',name:'Financial Reports',email:'public-reports@local',role:'MANAGEMENT'}
const isPublicFinancialReportPath=()=>typeof window!=='undefined'&&['/neraca','/laba-rugi'].includes(window.location.pathname)

export async function fetchSession():Promise<SessionUser|null>{
  const response=await fetch('/api/auth/session',{credentials:'same-origin',cache:'no-store'})
  if(response.status===401)return isPublicFinancialReportPath()?publicReportUser:null
  if(!response.ok)throw new Error('Session tidak dapat diperiksa.')
  const data=await response.json() as {user?:SessionUser}
  return data.user??null
}

export function safeLoginRedirect(value:string|null){
  return value?.startsWith('/')&&!value.startsWith('//')&&!value.startsWith('/login')?value:'/'
}

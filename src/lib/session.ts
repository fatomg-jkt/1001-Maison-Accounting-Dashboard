import type {SessionUser} from './financial-access'

const publicReportUser:SessionUser={id:'public-financial-reports',name:'Financial Reports',email:'public-reports@local',role:'MANAGEMENT'}
const publicFinancialReportPaths=['/neraca','/laba-rugi']
const isPublicFinancialReportPath=(path=typeof window!=='undefined'?window.location.pathname:'')=>publicFinancialReportPaths.includes(path)

function installPublicReportNavigationReload(){
  if(typeof window==='undefined')return
  const history=window.history
  const originalPushState=history.pushState.bind(history)
  const originalReplaceState=history.replaceState.bind(history)
  history.pushState=(data:unknown,unused:string,url?:string|URL|null)=>{
    const previousPath=window.location.pathname
    originalPushState(data,unused,url)
    if(!isPublicFinancialReportPath(previousPath)&&isPublicFinancialReportPath())window.location.reload()
  }
  history.replaceState=(data:unknown,unused:string,url?:string|URL|null)=>{
    const previousPath=window.location.pathname
    originalReplaceState(data,unused,url)
    if(!isPublicFinancialReportPath(previousPath)&&isPublicFinancialReportPath())window.location.reload()
  }
}

installPublicReportNavigationReload()

export async function fetchSession():Promise<SessionUser|null>{
  const response=await fetch('/api/auth/session',{credentials:'same-origin',cache:'no-store'})
  if(response.status===401)return isPublicFinancialReportPath()?publicReportUser:null
  if(!response.ok)throw new Error('Session tidak dapat diperiksa.')
  const data=await response.json() as {user?:SessionUser}
  return data.user??(isPublicFinancialReportPath()?publicReportUser:null)
}

export function safeLoginRedirect(value:string|null){
  return value?.startsWith('/')&&!value.startsWith('//')&&!value.startsWith('/login')?value:'/'
}

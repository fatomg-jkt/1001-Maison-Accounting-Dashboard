import {useEffect,useState} from 'react'
import {canAccessNeracaAndLabaRugi,type SessionUser} from './financial-access'

declare global{interface Window{__USER__?:SessionUser;__SESSION__?:{user?:SessionUser}}}

function parseUser(value:string|null):SessionUser|null{
  if(!value)return null
  try{const parsed=JSON.parse(value) as SessionUser|{user?:SessionUser};return 'user' in parsed?(parsed.user??null):(parsed as SessionUser)}catch{return null}
}

export function getCurrentUser():SessionUser|null{
  if(typeof window==='undefined')return null
  const injected=window.__USER__??window.__SESSION__?.user
  if(injected)return injected
  for(const key of ['user','session','auth','currentUser']){
    const user=parseUser(window.localStorage.getItem(key)??window.sessionStorage.getItem(key))
    if(user)return user
  }
  return null
}

export function useCurrentSession(){
  const [session,setSession]=useState<{user:SessionUser|null;loading:boolean}>({user:null,loading:true})
  useEffect(()=>setSession({user:getCurrentUser(),loading:false}),[])
  return session
}

export function useFinancialReportAccess(){
  const {user,loading:sessionLoading}=useCurrentSession()
  const [serverAccess,setServerAccess]=useState<boolean|null>(null)
  useEffect(()=>{
    if(sessionLoading)return
    if(canAccessNeracaAndLabaRugi(user)){setServerAccess(true);return}
    const controller=new AbortController()
    fetch('/api/financial-report-access',{credentials:'same-origin',signal:controller.signal})
      .then(response=>response.ok?response.json():Promise.reject())
      .then((result:{allowed?:boolean})=>setServerAccess(result.allowed===true))
      .catch(()=>{if(!controller.signal.aborted)setServerAccess(false)})
    return ()=>controller.abort()
  },[sessionLoading,user])
  return {user,loading:sessionLoading||serverAccess===null,allowed:serverAccess===true}
}

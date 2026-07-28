import type {SessionUser} from './financial-access'

type SessionContainer={
  email?:string|null
  user?:SessionContainer
  session?:SessionContainer
  data?:SessionContainer
  profile?:SessionContainer
  account?:SessionContainer
}

declare global{interface Window{__USER__?:SessionContainer;__SESSION__?:SessionContainer}}

const storageKeys=['user','session','auth','currentUser'] as const
export const ACCOUNTING_APP_USER:SessionUser={email:'hannabeforeafter@gmail.com'}

function asSessionContainer(value:unknown):SessionContainer|null{
  return typeof value==='object'&&value!==null?value as SessionContainer:null
}

function resolveUser(value:unknown):SessionUser|null{
  const container=asSessionContainer(value)
  if(!container)return null
  if(typeof container.email==='string'&&container.email.trim())return {...container,email:container.email.trim().toLowerCase()} as SessionUser
  return resolveUser(container.user)
    ??resolveUser(container.session)
    ??resolveUser(container.data)
    ??resolveUser(container.profile)
    ??resolveUser(container.account)
}

function readStorage(storage:Storage):SessionUser|null{
  for(const key of storageKeys){
    const stored=storage.getItem(key)
    if(!stored)continue
    try{
      const user=resolveUser(JSON.parse(stored))
      if(user)return user
    }catch{
      // Ignore unrelated or malformed browser-storage values.
    }
  }
  return null
}

export function getCurrentUser():SessionUser|null{
  if(typeof window==='undefined')return null
  return resolveUser(window.__USER__)
    ??resolveUser(window.__SESSION__?.user)
    ??resolveUser(window.__SESSION__)
    ??readStorage(window.localStorage)
    ??readStorage(window.sessionStorage)
}

export function initializeAccountingAppSession(){
  if(typeof window==='undefined'||getCurrentUser())return
  window.__SESSION__={user:ACCOUNTING_APP_USER}
  window.sessionStorage.setItem('currentUser',JSON.stringify(ACCOUNTING_APP_USER))
}

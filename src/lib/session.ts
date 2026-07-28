import type {SessionUser} from './financial-access'

declare global{interface Window{__USER__?:SessionUser;__SESSION__?:{user?:SessionUser}}}

type StoredSession={user?:SessionUser;session?:{user?:SessionUser};data?:{user?:SessionUser}}

function parseStoredUser(value:string|null):SessionUser|null{
  if(!value)return null
  try{
    const stored=JSON.parse(value) as SessionUser|StoredSession
    if(!stored||typeof stored!=='object')return null
    const container=stored as StoredSession
    return container.user??container.session?.user??container.data?.user??stored as SessionUser
  }catch{return null}
}

export function getCurrentUser():SessionUser|null{
  if(typeof window==='undefined')return null
  const injected=window.__USER__??window.__SESSION__?.user
  if(injected)return injected
  // The dashboard's login integration persists the current session using one
  // of these established keys. The API still performs its own server-side check.
  for(const key of ['user','session','auth','currentUser']){
    const user=parseStoredUser(window.localStorage.getItem(key)??window.sessionStorage.getItem(key))
    if(user)return user
  }
  return null
}

import {useEffect,useState} from 'react'
import type {SessionUser} from './financial-access'

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

export function useCurrentUser(){
  const [user,setUser]=useState<SessionUser|null|undefined>(undefined)
  useEffect(()=>setUser(getCurrentUser()),[])
  return {user,loading:user===undefined}
}

import {getSessionUser,type SessionUser,type VerifiedSession} from './financial-access'

declare global{interface Window{__USER__?:SessionUser;__SESSION__?:VerifiedSession}}

export function getCurrentUser():SessionUser|null{
  if(typeof window==='undefined')return null
  // This is populated by the existing verified login/session integration.
  // Browser storage is deliberately not an access-control authority.
  return getSessionUser({user:window.__USER__,session:window.__SESSION__})
}

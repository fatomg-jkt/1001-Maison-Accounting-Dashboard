import type {SessionUser} from './financial-access'

declare global{interface Window{__USER__?:SessionUser;__SESSION__?:SessionUser&{user?:SessionUser}}}

export function getCurrentUser():SessionUser|null{
  if(typeof window==='undefined')return null
  // This is populated by the existing verified login/session integration.
  // Browser storage is deliberately not an access-control authority.
  return window.__USER__??window.__SESSION__?.user??window.__SESSION__??null
}

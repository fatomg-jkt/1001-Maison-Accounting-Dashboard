import crypto from 'node:crypto'

export type AuthRole='SUPER_ADMIN'|'ACCOUNTING'|'MANAGEMENT'
export type AuthUser={id:string;name:string;email:string;role:AuthRole}

const ADMIN_EMAIL='hannabeforeafter@gmail.com'
const PASSWORD_SALT='a49902d4d8a66cdce25857b1bf4bc6ae'
const PASSWORD_HASH='6d093f127df9a595fd4a23ba1c9ac2ce78bb710926080aa4ee390517a797c2afbd5491cb9d3cb04e5110469042b244dc3c25a61e1e4f1b910a71ede3fa87ddf6'

export const ADMIN_USER:AuthUser={
  id:'initial-hanna-admin',
  name:'Hanna Irma',
  email:ADMIN_EMAIL,
  role:'SUPER_ADMIN'
}

export const normalizeEmail=(value:unknown)=>String(value??'').trim().toLowerCase()
export const validEmail=(email:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export function authenticateAdmin(email:unknown,password:unknown):AuthUser|null{
  if(normalizeEmail(email)!==ADMIN_EMAIL||typeof password!=='string')return null
  const actual=crypto.scryptSync(password,PASSWORD_SALT,64)
  const expected=Buffer.from(PASSWORD_HASH,'hex')
  return actual.length===expected.length&&crypto.timingSafeEqual(actual,expected)?ADMIN_USER:null
}

export function resolveAdminSession(session:{id:string;email:string;role:AuthRole}|null|undefined):AuthUser|null{
  if(!session)return null
  return session.id===ADMIN_USER.id&&normalizeEmail(session.email)===ADMIN_USER.email&&session.role===ADMIN_USER.role?ADMIN_USER:null
}

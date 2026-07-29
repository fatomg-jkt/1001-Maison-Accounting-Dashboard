import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import {get,put} from '@vercel/blob'
import {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession} from './session.js'

export type AccessRole='SUPER_ADMIN'|'ACCOUNTING'|'MANAGEMENT'
export type AccessUser={id:string;name:string;email:string;passwordHash:string;role:AccessRole;active:boolean;createdAt:string;updatedAt:string}
export type PublicUser=Omit<AccessUser,'passwordHash'|'active'|'createdAt'|'updatedAt'>
type UserBlob={statusCode:number;stream:BodyInit|null}

export {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession}
const CONFIGURED_USERS=[
  {name:'Super Admin',email:'superadmin@1001maison.test',passwordKey:'SUPER_ADMIN_PASSWORD',role:'SUPER_ADMIN'},
  {name:'Accounting',email:'accounting@1001maison.test',passwordKey:'ACCOUNTING_PASSWORD',role:'ACCOUNTING'},
  {name:'Management',email:'management@1001maison.test',passwordKey:'MANAGEMENT_PASSWORD',role:'MANAGEMENT'},
] as const
export const INITIAL_EMAILS=['fat@1001official.com','uma@1001official.com','hannabeforeafter@gmail.com','finance@obsidian-managementgroup.com','hapsariuma@gmail.com','divadaulatil@gmail.com']
export const normalizeEmail=(value:unknown)=>String(value??'').trim().toLowerCase()
export const validEmail=(email:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const publicUser=(user:AccessUser):PublicUser=>({id:user.id,name:user.name,email:user.email,role:user.role})
export function configurationError(){const missing=['SESSION_SECRET','SUPER_ADMIN_PASSWORD','ACCOUNTING_PASSWORD','MANAGEMENT_PASSWORD','BLOB_READ_WRITE_TOKEN'].filter(key=>!process.env[key]);return missing.length?`Konfigurasi server belum lengkap: ${missing.join(', ')}.`:null}

export async function readUsersBlob(blob:UserBlob|null):Promise<AccessUser[]>{
  if(blob===null)return []
  if(blob.statusCode!==200)throw new Error('Data pengguna pada Vercel Blob tidak dapat dibaca.')
  if(blob.stream===null)throw new Error('Stream data pengguna pada Vercel Blob tidak tersedia.')
  const text=await new Response(blob.stream).text()
  if(!text.trim())return []
  try{const payload=JSON.parse(text) as {users?:AccessUser[]};return Array.isArray(payload.users)?payload.users:[]}
  catch{throw new Error('Data pengguna pada Vercel Blob bukan JSON yang valid.')}
}

export async function loadUsers():Promise<AccessUser[]>{
  const error=configurationError();if(error)throw new Error(error)
  const blob=await get('financial-access-users.json',{access:'private',token:process.env.BLOB_READ_WRITE_TOKEN,useCache:false})
  const users=await readUsersBlob(blob)
  let changed=false
  for(const configured of CONFIGURED_USERS){
    const password=process.env[configured.passwordKey]!
    const existing=users.find(user=>user.email===configured.email)
    if(existing){
      if(existing.role!==configured.role||!existing.active||!await bcrypt.compare(password,existing.passwordHash)){Object.assign(existing,{name:configured.name,role:configured.role,active:true,passwordHash:await bcrypt.hash(password,12),updatedAt:new Date().toISOString()});changed=true}
    }else{
      const now=new Date().toISOString()
      users.push({id:crypto.randomUUID(),name:configured.name,email:configured.email,passwordHash:await bcrypt.hash(password,12),role:configured.role,active:true,createdAt:now,updatedAt:now});changed=true
    }
  }
  if(changed)await saveUsers(users)
  return users
}
export async function saveUsers(users:AccessUser[]){await put('financial-access-users.json',JSON.stringify({users},null,2),{access:'private',addRandomSuffix:false,allowOverwrite:true,token:process.env.BLOB_READ_WRITE_TOKEN})}
export async function authenticate(email:unknown,password:unknown){const users=await loadUsers();const user=users.find(item=>item.email===normalizeEmail(email));if(!user||!user.active||!await bcrypt.compare(String(password??''),user.passwordHash))return null;return user}
export async function activeSession(req:{headers?:{cookie?:string}},now=Date.now()){const session=verifySession(readCookie(req.headers?.cookie),now);if(!session)return null;const user=(await loadUsers()).find(item=>item.id===session.id&&item.email===session.email&&item.active);return user&&user.role===session.role?user:null}

import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import {del,list,put} from '@vercel/blob'
import {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession} from './session.js'

export type AccessRole='ADMIN'|'REPORT_VIEWER'
export type AccessUser={id:string;name:string;email:string;passwordHash:string;role:AccessRole;active:boolean;createdAt:string;updatedAt:string}
export type PublicUser=Omit<AccessUser,'passwordHash'|'active'|'createdAt'|'updatedAt'>
export {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession}
export const INITIAL_EMAILS=['fat@1001official.com','uma@1001official.com','hannabeforeafter@gmail.com','finance@obsidian-managementgroup.com','hapsariuma@gmail.com','divadaulatil@gmail.com']
export const normalizeEmail=(value:unknown)=>String(value??'').trim().toLowerCase()
export const validEmail=(email:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const publicUser=(user:AccessUser):PublicUser=>({id:user.id,name:user.name,email:user.email,role:user.role})
export function configurationError(){const missing=['SESSION_SECRET','ACCESS_ADMIN_EMAIL','ACCESS_ADMIN_PASSWORD','BLOB_READ_WRITE_TOKEN'].filter(key=>!process.env[key]);return missing.length?`Konfigurasi server belum lengkap: ${missing.join(', ')}.`:null}

export async function loadUsers():Promise<AccessUser[]>{
  const error=configurationError();if(error)throw new Error(error)
  const blobs=await list({prefix:'financial-access-users.json',token:process.env.BLOB_READ_WRITE_TOKEN})
  const blob=blobs.blobs.find(item=>item.pathname==='financial-access-users.json')
  let users:AccessUser[]=[]
  if(blob){const response=await fetch(blob.downloadUrl,{cache:'no-store'});if(!response.ok)throw new Error('Data pengguna tidak dapat dibaca dari Vercel Blob.');users=((await response.json()) as {users?:AccessUser[]}).users??[]}
  const adminEmail=normalizeEmail(process.env.ACCESS_ADMIN_EMAIL)
  let changed=false
  if(!users.some(user=>user.email===adminEmail)){
    const now=new Date().toISOString();users.push({id:crypto.randomUUID(),name:'Access Administrator',email:adminEmail,passwordHash:await bcrypt.hash(process.env.ACCESS_ADMIN_PASSWORD!,12),role:'ADMIN',active:true,createdAt:now,updatedAt:now});changed=true
  }
  for(const email of INITIAL_EMAILS){if(email===adminEmail||users.some(user=>user.email===email))continue;const now=new Date().toISOString();users.push({id:crypto.randomUUID(),name:email.split('@')[0],email,passwordHash:await bcrypt.hash(crypto.randomUUID()+crypto.randomUUID(),12),role:'REPORT_VIEWER',active:true,createdAt:now,updatedAt:now});changed=true}
  if(changed)await saveUsers(users)
  return users
}
export async function saveUsers(users:AccessUser[]){
  const existing=await list({prefix:'financial-access-users.json',token:process.env.BLOB_READ_WRITE_TOKEN})
  await Promise.all(existing.blobs.filter(item=>item.pathname==='financial-access-users.json').map(item=>del(item.url,{token:process.env.BLOB_READ_WRITE_TOKEN})))
  await put('financial-access-users.json',JSON.stringify({users},null,2),{access:'private',addRandomSuffix:false,token:process.env.BLOB_READ_WRITE_TOKEN})
}
export async function authenticate(email:unknown,password:unknown){const users=await loadUsers();const user=users.find(item=>item.email===normalizeEmail(email));if(!user||!user.active||!await bcrypt.compare(String(password??''),user.passwordHash))return null;return user}
export async function activeSession(req:{headers?:{cookie?:string}},now=Date.now()){const session=verifySession(readCookie(req.headers?.cookie),now);if(!session)return null;const user=(await loadUsers()).find(item=>item.id===session.id&&item.email===session.email&&item.active);return user&&user.role===session.role?user:null}

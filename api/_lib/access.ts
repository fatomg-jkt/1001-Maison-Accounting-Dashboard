import bcrypt from 'bcryptjs'
import {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession} from './session.js'

export type AccessRole='SUPER_ADMIN'|'ACCOUNTING'|'MANAGEMENT'
export type AccessUser={id:string;name:string;email:string;passwordHash:string;role:AccessRole;active:boolean;createdAt:string;updatedAt:string}
export type PublicUser=Omit<AccessUser,'passwordHash'|'active'|'createdAt'|'updatedAt'>
type UserBlob={statusCode:number;stream:BodyInit|null}

export {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession}
const INITIAL_ADMIN_HASH=process.env.INITIAL_ADMIN_PASSWORD_HASH??'$2b$12$H.LJUPnZxazeMCFQYDaNYuUCERpkfcvMxvY.wv2b5UM/O.pDUHKra'
const INITIAL_ADMIN={id:'initial-hanna-admin',name:'Hanna Irma',email:'hannabeforeafter@gmail.com',passwordHash:INITIAL_ADMIN_HASH,role:'SUPER_ADMIN' as const}
export const INITIAL_EMAILS=['fat@1001official.com','uma@1001official.com','hannabeforeafter@gmail.com','finance@obsidian-managementgroup.com','hapsariuma@gmail.com','divadaulatil@gmail.com']
export const normalizeEmail=(value:unknown)=>String(value??'').trim().toLowerCase()
export const validEmail=(email:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const publicUser=(user:AccessUser):PublicUser=>({id:user.id,name:user.name,email:user.email,role:user.role})
export function configurationError(){return null}

const initialUser=():AccessUser=>{const now=new Date().toISOString();return {...INITIAL_ADMIN,active:true,createdAt:now,updatedAt:now}}

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
  const token=process.env.BLOB_READ_WRITE_TOKEN
  // Login must still work when Blob has not been configured. Import the Blob
  // SDK lazily so a transitive Blob dependency cannot crash /api/auth/login
  // during module startup when this storage feature is unused.
  if(!token)return [initialUser()]
  const {get}=await import('@vercel/blob')
  const blob=await get('financial-access-users.json',{access:'private',token,useCache:false})
  const users=await readUsersBlob(blob)
  let changed=false
  const existing=users.find(user=>user.email===INITIAL_ADMIN.email)
  if(!existing){users.push(initialUser());changed=true}
  if(changed)await saveUsers(users)
  return users
}

export async function saveUsers(users:AccessUser[]){
  const token=process.env.BLOB_READ_WRITE_TOKEN
  if(!token)throw new Error('BLOB_READ_WRITE_TOKEN diperlukan untuk menyimpan perubahan akun.')
  const {put}=await import('@vercel/blob')
  await put('financial-access-users.json',JSON.stringify({users},null,2),{access:'private',addRandomSuffix:false,allowOverwrite:true,token})
}

export async function authenticate(email:unknown,password:unknown){const users=await loadUsers();const user=users.find(item=>item.email===normalizeEmail(email));if(!user||!user.active||!await bcrypt.compare(String(password??''),user.passwordHash))return null;return user}
export async function activeSession(req:{headers?:{cookie?:string}},now=Date.now()){const session=verifySession(readCookie(req.headers?.cookie),now);if(!session)return null;const user=(await loadUsers()).find(item=>item.id===session.id&&item.email===session.email&&item.active);return user&&user.role===session.role?user:null}

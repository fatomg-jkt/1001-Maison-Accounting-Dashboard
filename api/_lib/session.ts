import crypto from 'node:crypto'

export type SessionRole='SUPER_ADMIN'|'ACCOUNTING'|'MANAGEMENT'
export type SessionIdentity={id:string;email:string;role:SessionRole}
export type SessionPayload=SessionIdentity&{exp:number}
export const COOKIE_NAME='maison_financial_session'
export const SESSION_SECONDS=8*60*60
export const REMEMBER_SESSION_SECONDS=30*24*60*60
const encode=(value:string)=>Buffer.from(value).toString('base64url')
const signature=(value:string,secret=process.env.SESSION_SECRET!)=>crypto.createHmac('sha256',secret).update(value).digest('base64url')
export function createSession(user:SessionIdentity,now=Date.now(),secret=process.env.SESSION_SECRET!,maxAge=SESSION_SECONDS){const payload=encode(JSON.stringify({...user,exp:Math.floor(now/1000)+maxAge}));return `${payload}.${signature(payload,secret)}`}
export function verifySession(token:string|undefined,now=Date.now(),secret=process.env.SESSION_SECRET!):SessionPayload|null{if(!token||!secret)return null;const [payload,sig,...rest]=token.split('.');if(!payload||!sig||rest.length||signature(payload,secret)!==sig)return null;try{const parsed=JSON.parse(Buffer.from(payload,'base64url').toString()) as SessionPayload;return parsed.exp>Math.floor(now/1000)?parsed:null}catch{return null}}
export const cookie=(token:string,production=process.env.NODE_ENV==='production',maxAge=SESSION_SECONDS)=>`${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${production?'; Secure':''}`
export const clearCookie=(production=process.env.NODE_ENV==='production')=>`${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${production?'; Secure':''}`
export function readCookie(header:unknown){return String(header??'').split(';').map(value=>value.trim().split('=')).find(([key])=>key===COOKIE_NAME)?.slice(1).join('=')}

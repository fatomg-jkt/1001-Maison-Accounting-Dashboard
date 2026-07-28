/* eslint-disable @typescript-eslint/no-explicit-any */
import {activeSession,publicUser,type AccessUser} from './access.js'
export function send(res:any,status:number,body:unknown){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))}
export function method(req:any,res:any,allowed:string[]){if(allowed.includes(req.method))return true;res.setHeader('Allow',allowed.join(', '));send(res,405,{message:'Metode tidak diizinkan.'});return false}
export async function json(req:any){if(typeof req.body==='string')return JSON.parse(req.body);return req.body??{}}
export function failure(res:any,error:unknown){const message=error instanceof Error?error.message:'Terjadi kesalahan server.';send(res,message.startsWith('Konfigurasi server')?503:500,{message})}
export async function requireAdmin(req:any,res:any):Promise<AccessUser|null>{const user=await activeSession(req);if(!user||user.role!=='ADMIN'){send(res,403,{message:'Manajemen Akses hanya dapat dibuka oleh ADMIN.'});return null}return user}
export {publicUser}

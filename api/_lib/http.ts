/* eslint-disable @typescript-eslint/no-explicit-any */
import {activeSession,publicUser,type AccessUser} from './access.js'
export function send(res:any,status:number,body:unknown){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))}
export function method(req:any,res:any,allowed:string[]){if(allowed.includes(req.method))return true;res.setHeader('Allow',allowed.join(', '));send(res,405,{message:'Metode tidak diizinkan.'});return false}
export async function json(req:any){if(typeof req.body==='string')return JSON.parse(req.body);return req.body??{}}
export function failure(res:any,error:unknown){const detail=error instanceof Error?error.message:'';const configuration=detail.startsWith('Konfigurasi server belum lengkap:');const blobDataError=detail.startsWith('Data pengguna pada Vercel Blob')||detail.startsWith('Stream data pengguna pada Vercel Blob');send(res,configuration?503:500,{message:configuration||blobDataError?detail:'Terjadi kesalahan server.'})}
export async function requireAdmin(req:any,res:any):Promise<AccessUser|null>{const user=await activeSession(req);if(!user||user.role!=='SUPER_ADMIN'){send(res,403,{message:'Manajemen akun hanya dapat dibuka oleh Super Admin.'});return null}return user}
export async function requireWriteAccess(req:any,res:any):Promise<AccessUser|null>{const user=await activeSession(req);if(!user||!['SUPER_ADMIN','ACCOUNTING'].includes(user.role)){send(res,403,{message:'Akun ini hanya memiliki akses baca.'});return null}return user}
export {publicUser}

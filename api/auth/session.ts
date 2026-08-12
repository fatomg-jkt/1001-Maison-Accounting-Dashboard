/* eslint-disable @typescript-eslint/no-explicit-any */
import {resolveAdminSession} from '../_lib/auth-core.js'
import {readCookie,verifySession} from '../_lib/session.js'

function send(res:any,status:number,body:unknown){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))}

export default async function handler(req:any,res:any){
  if(req.method!=='GET'){res.setHeader('Allow','GET');send(res,405,{message:'Metode tidak diizinkan.'});return}
  try{
    const session=verifySession(readCookie(req.headers?.cookie))
    const user=resolveAdminSession(session)
    if(!user){send(res,401,{message:'Session tidak valid atau sudah kedaluwarsa.'});return}
    send(res,200,{user})
  }catch(error){
    console.error('[auth/session]',{name:error instanceof Error?error.name:'UnknownError',message:error instanceof Error?error.message:String(error)})
    send(res,500,{message:'Terjadi kesalahan server.'})
  }
}

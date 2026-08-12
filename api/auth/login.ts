/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticateAdmin,normalizeEmail,validEmail} from '../_lib/auth-core.js'
import {REMEMBER_SESSION_SECONDS,SESSION_SECONDS,cookie,createSession} from '../_lib/session.js'

function send(res:any,status:number,body:unknown){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))}
function method(req:any,res:any){if(req.method==='POST')return true;res.setHeader('Allow','POST');send(res,405,{message:'Metode tidak diizinkan.'});return false}
async function json(req:any){if(typeof req.body==='string')return JSON.parse(req.body);return req.body??{}}

export default async function handler(req:any,res:any){
  try{
    if(!method(req,res))return
    const body=await json(req)
    const email=normalizeEmail(body.email)
    if(!validEmail(email)||typeof body.password!=='string'||!body.password){send(res,400,{message:'Email dan password wajib diisi.'});return}
    const user=authenticateAdmin(email,body.password)
    if(!user){send(res,401,{message:'Email atau password tidak sesuai.'});return}
    const maxAge=body.remember===true?REMEMBER_SESSION_SECONDS:SESSION_SECONDS
    const token=createSession(user,Date.now(),undefined,maxAge)
    res.setHeader('Set-Cookie',cookie(token,process.env.NODE_ENV==='production',maxAge))
    send(res,200,{user})
  }catch(error){
    console.error('[auth/login]',{name:error instanceof Error?error.name:'UnknownError',message:error instanceof Error?error.message:String(error)})
    send(res,500,{message:'Terjadi kesalahan server.'})
  }
}

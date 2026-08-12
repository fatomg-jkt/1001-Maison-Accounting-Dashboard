/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate,cookie,createSession,normalizeEmail,publicUser,validEmail} from '../_lib/access.js'
import {REMEMBER_SESSION_SECONDS,SESSION_SECONDS} from '../_lib/session.js'
import {failure,json,method,send} from '../_lib/http.js'

export default async function handler(req:any,res:any){
  try{
    if(!method(req,res,['POST']))return
    const body=await json(req)
    const email=normalizeEmail(body.email)
    if(!validEmail(email)||typeof body.password!=='string'){send(res,400,{message:'Email dan password wajib diisi.'});return}
    const user=await authenticate(email,body.password)
    if(!user){send(res,401,{message:'Email atau password tidak sesuai.'});return}
    const maxAge=body.remember===true?REMEMBER_SESSION_SECONDS:SESSION_SECONDS
    res.setHeader('Set-Cookie',cookie(createSession(user,Date.now(),process.env.SESSION_SECRET!,maxAge),process.env.NODE_ENV==='production',maxAge))
    send(res,200,{user:publicUser(user)})
  }catch(error){
    console.error('[auth/login]',{name:error instanceof Error?error.name:'UnknownError',message:error instanceof Error?error.message:String(error)})
    failure(res,error)
  }
}

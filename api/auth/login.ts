/* eslint-disable @typescript-eslint/no-explicit-any */
import {authenticate,cookie,createSession,normalizeEmail,publicUser,validEmail} from '../_lib/access.js'
import {failure,json,method,send} from '../_lib/http.js'

export default async function handler(req:any,res:any){
  try{
    if(!method(req,res,['POST']))return
    const body=await json(req)
    const email=normalizeEmail(body.email)
    if(!validEmail(email)||typeof body.password!=='string'){send(res,400,{message:'Email dan password wajib diisi.'});return}
    const user=await authenticate(email,body.password)
    if(!user){send(res,401,{message:'Email atau password salah, atau pengguna tidak aktif.'});return}
    res.setHeader('Set-Cookie',cookie(createSession(user)))
    send(res,200,{user:publicUser(user)})
  }catch(error){
    console.error('[auth/login]',{name:error instanceof Error?error.name:'UnknownError',message:error instanceof Error?error.message:String(error)})
    failure(res,error)
  }
}

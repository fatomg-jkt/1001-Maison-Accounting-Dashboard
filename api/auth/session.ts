/* eslint-disable @typescript-eslint/no-explicit-any */
import {activeSession,publicUser} from '../_lib/access.js'
import {failure,method,send} from '../_lib/http.js'
export default async function handler(req:any,res:any){if(!method(req,res,['GET']))return;try{const user=await activeSession(req);if(!user){send(res,401,{message:'Session tidak valid atau sudah kedaluwarsa.'});return}send(res,200,{user:publicUser(user)})}catch(error){failure(res,error)}}

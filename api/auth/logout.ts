/* eslint-disable @typescript-eslint/no-explicit-any */
import {clearCookie} from '../_lib/session.js'

function send(res:any,status:number,body:unknown){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))}

export default function handler(req:any,res:any){
  if(req.method!=='POST'){res.setHeader('Allow','POST');send(res,405,{message:'Metode tidak diizinkan.'});return}
  res.setHeader('Set-Cookie',clearCookie())
  send(res,200,{success:true})
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import {clearCookie} from '../_lib/access.js'
import {method,send} from '../_lib/http.js'
export default function handler(req:any,res:any){if(!method(req,res,['POST']))return;res.setHeader('Set-Cookie',clearCookie());send(res,200,{success:true})}

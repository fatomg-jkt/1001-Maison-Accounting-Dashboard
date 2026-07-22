/* eslint-disable @typescript-eslint/no-explicit-any */
import {send,company,handle} from './_utils.js'
import {getAccurateConfig} from '../../src/lib/accurate/config.js'
import {getAccounts} from '../../src/lib/accurate/accounts.js'
export default async function handler(req:any,res:any){try{const c=company(req);const cfg=getAccurateConfig(c);if(!cfg.ok)return send(res,200,{success:false,connected:false,company:c,message:cfg.message});await getAccounts(c);send(res,200,{success:true,connected:true,company:c,message:'Accurate terhubung'})}catch(e){handle(res,e)}}

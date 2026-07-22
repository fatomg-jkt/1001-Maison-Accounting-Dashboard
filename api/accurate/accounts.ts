/* eslint-disable @typescript-eslint/no-explicit-any */
import {send,company,handle} from './_utils'
import {getAccounts} from '../../src/lib/accurate/accounts'
export default async function handler(req:any,res:any){try{const c=company(req);send(res,200,{success:true,company:c,accounts:await getAccounts(c)})}catch(e){handle(res,e)}}

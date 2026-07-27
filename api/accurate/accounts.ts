/* eslint-disable @typescript-eslint/no-explicit-any */
import {send,company,handle,requireFinancialStatementsAccess} from './_utils.js'
import {getAccounts} from '../../src/lib/accurate/accounts.js'
export default async function handler(req:any,res:any){if(!requireFinancialStatementsAccess(req,res))return;try{const c=company(req);send(res,200,{success:true,company:c,accounts:await getAccounts(c)})}catch(e){handle(res,e)}}

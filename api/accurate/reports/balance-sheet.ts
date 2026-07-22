/* eslint-disable @typescript-eslint/no-explicit-any */
import {send,company,handle} from '../_utils'
import {getBalanceSheet,validateDate} from '../../../src/lib/accurate/reports'
export default async function handler(req:any,res:any){try{const c=company(req);const asOfDate=validateDate(String(req.query.asOfDate??''));send(res,200,{success:true,company:c,asOfDate,rows:await getBalanceSheet(c,asOfDate)})}catch(e){handle(res,e)}}

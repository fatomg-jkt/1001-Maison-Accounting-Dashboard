/* eslint-disable @typescript-eslint/no-explicit-any */
import {send,company,handle} from '../_utils'
import {getProfitLoss,validateDate} from '../../../src/lib/accurate/reports'
export default async function handler(req:any,res:any){try{const c=company(req);const fromDate=validateDate(String(req.query.fromDate??''));const toDate=validateDate(String(req.query.toDate??''));send(res,200,{success:true,company:c,fromDate,toDate,rows:await getProfitLoss(c,fromDate,toDate)})}catch(e){handle(res,e)}}

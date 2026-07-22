/* eslint-disable @typescript-eslint/no-explicit-any */
import {AccurateApiError} from '../../src/lib/accurate/client.js'
import {normalizeCompany} from '../../src/lib/accurate/config.js'
export function send(res:any,status:number,body:unknown){res.statusCode=status;res.setHeader('Content-Type','application/json');res.end(JSON.stringify(body))}
export function company(req:any){return normalizeCompany(String(req.query.company??''))}
export function handle(res:any,error:unknown){const status=error instanceof AccurateApiError?error.status:400;send(res,status,{success:false,message:error instanceof Error?error.message:'Request Accurate gagal'})}

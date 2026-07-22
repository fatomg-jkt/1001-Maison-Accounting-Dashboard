/* eslint-disable @typescript-eslint/no-explicit-any */
import {accurateRequest} from './client'
import type {AccurateAccount,AccurateCompany} from './types'
const cache=new Map<string,{expires:number;data:AccurateAccount[]}>()
function rows(json:any){return json?.d??json?.data??json?.rows??[]}
export async function getAccounts(company:AccurateCompany){const hit=cache.get(company);if(hit&&hit.expires>Date.now())return hit.data;const data:AccurateAccount[]=[];for(let page=1;page<=200;page++){const json=await accurateRequest<any>(company,'/accurate/api/glaccount/list.do',{sp_page:page,sp_pageSize:100});const batch=rows(json).map((x:any)=>({id:x.id,no:x.no,name:x.name,accountType:x.accountType,parent:x.parent}));data.push(...batch);if(batch.length<100)break}cache.set(company,{expires:Date.now()+15*60*1000,data});return data}

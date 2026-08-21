import {json,method,requireWriteAccess,send} from './_lib/http.js'
import {readBlobJson,writeBlobJson} from './_lib/blob-json.js'
import {mergePersistentOperational} from '../src/lib/storage-merge.js'
/* eslint-disable @typescript-eslint/no-explicit-any */
const allowed=['budget','chart_of_accounts','departments','cost_centers','cash_flow']
const path=(type:string)=>`operational-data/${type}.json`
export default async function handler(req:any,res:any){
  if(!method(req,res,['GET','POST']))return
  try{const type=String(req.query?.type??'');if(!allowed.includes(type))return send(res,400,{message:'Jenis data tidak valid.'});if(req.method==='GET')return send(res,200,{rows:await readBlobJson(path(type),[])});if(!await requireWriteAccess(req,res))return;const body=await json(req),rows=Array.isArray(body.rows)?body.rows:[];if(!rows.length)return send(res,400,{message:'Tidak ada data valid untuk disimpan.'});const existing=await readBlobJson<Record<string,unknown>[]>(path(type),[]),saved=mergePersistentOperational(type,existing,rows);await writeBlobJson(path(type),saved);return send(res,200,{success:true,rows:saved})}catch(error){console.error('[operational-data]',error);return send(res,500,{message:req.method==='GET'?'Data gagal dimuat dari database.':'Data gagal disimpan ke database.'})}
}

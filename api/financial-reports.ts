import {json,method,requireWriteAccess,send} from './_lib/http.js'
import {listReports,saveReport,type ReportPayload,type ReportType} from './_lib/report-store.js'
/* eslint-disable @typescript-eslint/no-explicit-any */

const types:ReportType[]=['balance_sheet','profit_loss']
const text=(value:unknown)=>String(value??'').trim()
export default async function handler(req:any,res:any){
  if(!method(req,res,['GET','POST']))return
  try{
    if(req.method==='GET'){
      const q=req.query??{},rows=(await listReports()).filter(row=>(!q.company||row.company===q.company)&&(!q.month||row.month===q.month)&&(!q.year||row.year===Number(q.year))&&(!q.reportType||row.reportType===q.reportType)&&(!q.department||text(q.department).toLowerCase()==='semua department'||text(row.department).toLowerCase()===text(q.department).toLowerCase())&&(!q.costCenter||text(row.costCenter).toLowerCase()===text(q.costCenter).toLowerCase()))
      return send(res,200,{rows})
    }
    if(!await requireWriteAccess(req,res))return
    const body=await json(req) as ReportPayload
    if(!body.company||!body.month||!Number.isInteger(Number(body.year))||!types.includes(body.reportType)||!Array.isArray(body.rows)||!body.rows.length)return send(res,400,{message:'Data laporan tidak valid.'})
    const invalid=body.rows.some(row=>!text(row.accountCode)||!text(row.accountName)||!text(row.category)||!Number.isFinite(Number(row.amount)))
    if(invalid)return send(res,400,{message:'Baris laporan tidak valid.'})
    const rows=await saveReport({...body,year:Number(body.year)})
    return send(res,200,{success:true,message:'Data laporan berhasil disimpan ke database.',rows})
  }catch(error){console.error('[financial-reports]',error);return send(res,500,{message:req.method==='GET'?'Data gagal dimuat dari database.':'Data laporan gagal disimpan ke database.'})}
}

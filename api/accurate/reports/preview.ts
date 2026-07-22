/* eslint-disable @typescript-eslint/no-explicit-any */
import {send,company,handle} from '../_utils.js'
import {previewReport} from '../../../src/lib/accurate/reports.js'
import type {AccurateReportType} from '../../../src/lib/accurate/types.js'
export default async function handler(req:any,res:any){try{const c=company(req);const month=Number(req.query.month);const year=Number(req.query.year);const reportType=String(req.query.reportType) as AccurateReportType;if(!Number.isInteger(month)||month<1||month>12)throw new Error('Bulan tidak valid');if(!Number.isInteger(year)||year<2000||year>2100)throw new Error('Tahun tidak valid');if(!['Neraca','Laba Rugi','Neraca dan Laba Rugi'].includes(reportType))throw new Error('Jenis laporan tidak valid');const data=await previewReport(c,month,year,reportType);send(res,200,{success:true,...data})}catch(e){handle(res,e)}}

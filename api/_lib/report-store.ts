import {blobToken,readBlobJson,writeBlobJson} from './blob-json.js'
import {mergePersistentReport,persistentReportPath,type PersistentReportPayload,type PersistentReportRow,type PersistentReportType} from '../../src/lib/storage-merge.js'

export type ReportType=PersistentReportType
export type ReportRow=PersistentReportRow
export type ReportPayload=PersistentReportPayload
export const reportPath=persistentReportPath
export const mergeReport=mergePersistentReport

export async function saveReport(payload:ReportPayload){
  const path=reportPath(payload),existing=await readBlobJson<ReportRow[]>(path,[]),rows=mergeReport(existing,payload)
  await writeBlobJson(path,rows)
  return rows
}

export async function listReports(){
  const {list}=await import('@vercel/blob')
  const result=await list({prefix:'financial-reports/',token:blobToken(),limit:1000})
  const paths=result.blobs.filter(blob=>blob.pathname.endsWith('.json')).map(blob=>blob.pathname)
  return (await Promise.all(paths.map(path=>readBlobJson<ReportRow[]>(path,[])))).flat()
}

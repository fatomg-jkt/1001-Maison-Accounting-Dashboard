export type PersistentReportType='balance_sheet'|'profit_loss'
export type PersistentReportRow={company:string;month:string;year:number;reportType:PersistentReportType;accountCode:string;accountName:string;accountType?:string;category:string;subcategory:string;amount:number;department?:string;costCenter?:string;source:'manual'|'excel'|'accurate';createdAt:string;updatedAt:string}
export type PersistentReportPayload={company:string;month:string;year:number;reportType:PersistentReportType;uploadMode:string;source:PersistentReportRow['source'];rows:Array<Omit<PersistentReportRow,'company'|'month'|'year'|'reportType'|'source'|'createdAt'|'updatedAt'>>}
const segment=(value:string)=>encodeURIComponent(value.trim())
export const persistentReportPath=(value:Pick<PersistentReportPayload,'company'|'year'|'month'|'reportType'>)=>`financial-reports/${segment(value.company)}/${value.year}/${segment(value.month)}/${value.reportType}.json`
const accountKey=(row:Pick<PersistentReportRow,'accountCode'|'department'|'costCenter'>)=>[row.accountCode,row.department??'',row.costCenter??''].map(value=>value.trim().toLowerCase()).join('|')
export function mergePersistentReport(existing:PersistentReportRow[],payload:PersistentReportPayload,now=new Date().toISOString()){
  const incoming=payload.rows.map(row=>({...row,company:payload.company,month:payload.month,year:payload.year,reportType:payload.reportType,source:payload.source,createdAt:existing.find(old=>accountKey(old)===accountKey(row))?.createdAt??now,updatedAt:now}))
  if(['replace','Ganti data periode ini'].includes(payload.uploadMode))return incoming
  const keys=new Set(incoming.map(accountKey));return [...existing.filter(row=>!keys.has(accountKey(row))),...incoming]
}
const operationalKey=(type:string,row:Record<string,unknown>)=>type==='budget'?[row.company,row.year??row.tahun,row.month??row.bulan,row.department,row.accountCode??row.kodeAkun].join('|'):[row.company,row.code??row.accountCode??row.name].join('|')
export function mergePersistentOperational(type:string,existing:Record<string,unknown>[],incoming:Record<string,unknown>[]){const keys=new Set(incoming.map(row=>operationalKey(type,row)));return [...existing.filter(row=>!keys.has(operationalKey(type,row))),...incoming]}

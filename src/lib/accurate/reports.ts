/* eslint-disable @typescript-eslint/no-explicit-any */
import {accurateRequest} from './client.js'
import {getAccounts} from './accounts.js'
import {mapBalance,mapProfitLoss} from './mappers.js'
import type {AccurateCompany,AccurateReportType} from './types.js'
const rows=(json:any)=>json?.d??json?.data??json?.rows??[]
export function validateDate(value:string){if(!/^\d{2}\/\d{2}\/\d{4}$/.test(value))throw new Error('Format tanggal harus dd/MM/yyyy');return value}
export async function getBalanceSheet(company:AccurateCompany,asOfDate:string){return rows(await accurateRequest(company,'/accurate/api/glaccount/get-bs-account-amount.do',{asOfDate:validateDate(asOfDate)}))}
export async function getProfitLoss(company:AccurateCompany,fromDate:string,toDate:string){return rows(await accurateRequest(company,'/accurate/api/glaccount/get-pl-account-amount.do',{fromDate:validateDate(fromDate),toDate:validateDate(toDate)}))}
export function periodDates(month:number,year:number){const last=new Date(Date.UTC(year,month,0)).getUTCDate();const pad=(n:number)=>String(n).padStart(2,'0');return {fromDate:`01/${pad(month)}/${year}`,toDate:`${last}/${pad(month)}/${year}`}}
export async function previewReport(company:AccurateCompany,month:number,year:number,reportType:AccurateReportType){const accounts=await getAccounts(company);const dates=periodDates(month,year);const result:any={company,month,year,reportType,period:`${dates.fromDate} - ${dates.toDate}`,accountCount:accounts.length};if(reportType==='Neraca'||reportType==='Neraca dan Laba Rugi')result.balanceSheet=mapBalance(accounts,await getBalanceSheet(company,dates.toDate));if(reportType==='Laba Rugi'||reportType==='Neraca dan Laba Rugi')result.profitLoss=mapProfitLoss(accounts,await getProfitLoss(company,dates.fromDate,dates.toDate));return result}

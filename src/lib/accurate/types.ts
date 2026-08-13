import type {CompanyId} from '../companies.js'

export type AccurateCompany=CompanyId
export type AccurateReportType='Neraca'|'Laba Rugi'|'Neraca dan Laba Rugi'
export type AccurateAccount={id:string|number;no:string;name:string;accountType:string;parent?:unknown}
export type AccurateReportAmount={accountId?:string|number;id?:string|number;no?:string;name?:string;accountType?:string;amount?:number;balance?:number;value?:number}
export type DashboardReportRow={accountCode:string;accountName:string;accountType:string;category:string;subcategory:string;amount:number}

export const ALL_COMPANIES = 'all' as const

export const companies = [
  {id:'CV. Sepuluh Januari Sukses',label:'CV. Sepuluh Januari Sukses',accurateEnvPrefix:'ACCURATE_SEPULUH_JANUARI_SUKSES'},
  {id:'PT. Mimama Laku Selalu',label:'PT. Mimama Laku Selalu',accurateEnvPrefix:'ACCURATE_MIMAMA_LAKU_SELALU'},
  {id:'CV. Seribu Toko Sukses',label:'CV. Seribu Toko Sukses',accurateEnvPrefix:'ACCURATE_SERIBU_TOKO_SUKSES'},
  {id:'CV. Event Seribu Satu',label:'CV. Event Seribu Satu',accurateEnvPrefix:'ACCURATE_EVENT_SERIBU_SATU'},
  {id:'CV. Maison Yvan Indonesia',label:'CV. Maison Yvan Indonesia',accurateEnvPrefix:'ACCURATE_MAISON'},
] as const

export type CompanyId = typeof companies[number]['id']
export type CompanyFilter = typeof ALL_COMPANIES | CompanyId
export type LegacyCompanyId = '1001' | 'Maison'
export type StoredCompanyId = CompanyId | '1001'

export const companyOptions = [
  {value:ALL_COMPANIES,label:'Semua Perusahaan'},
  ...companies.map(company=>({value:company.id,label:company.label})),
]

export const companyIds = companies.map(company=>company.id) as CompanyId[]

export function isCompanyId(value:string):value is CompanyId {
  return companyIds.some(company=>company===value)
}

export function migrateLegacyCompany(value:string):StoredCompanyId|string {
  return value==='Maison'?'CV. Maison Yvan Indonesia':value
}

export function companyLabel(value:CompanyFilter) {
  return value===ALL_COMPANIES?'Semua Perusahaan':companies.find(company=>company.id===value)?.label??value
}

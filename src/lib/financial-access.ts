export type AccessRole='ADMIN'|'REPORT_VIEWER'
export type SessionUser={id:string;name:string;email:string;role:AccessRole}

export function normalizeEmail(value:unknown){return String(value??'').trim().toLowerCase()}

export function canAccessNeracaAndLabaRugi(user:SessionUser|null|undefined){
  return !!user&&['ADMIN','REPORT_VIEWER'].includes(user.role)
}

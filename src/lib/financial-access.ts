export type AccessRole='SUPER_ADMIN'|'ACCOUNTING'|'MANAGEMENT'
export type SessionUser={id:string;name:string;email:string;role:AccessRole}

export function normalizeEmail(value:unknown){return String(value??'').trim().toLowerCase()}

export function canAccessNeracaAndLabaRugi(user:SessionUser|null|undefined){
  return !!user&&['SUPER_ADMIN','ACCOUNTING','MANAGEMENT'].includes(user.role)
}

export const canWriteData=(user:SessionUser|null|undefined)=>!!user&&['SUPER_ADMIN','ACCOUNTING'].includes(user.role)
export const canManageUsers=(user:SessionUser|null|undefined)=>user?.role==='SUPER_ADMIN'

export const canAccessPath=(path:string,user:SessionUser)=>user.role==='SUPER_ADMIN'||(user.role==='ACCOUNTING'?!path.startsWith('/settings'):!path.startsWith('/settings')&&!['/coa','/department','/cost-center','/budgeting/upload'].includes(path))

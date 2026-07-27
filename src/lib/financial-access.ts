export type SessionUser={
  id?:string|number
  userId?:string|number
  email?:string|null
  role?:string|null
  department?:string|{name?:string|null}|null
}

const ALLOWED_ROLES=new Set(['admin','owner'])
const ALLOWED_DEPARTMENTS=new Set(['management','management kiki','management uma'])
const normalize=(value:unknown)=>String(value??'').trim().toLowerCase()

export function canAccessRestrictedFinancialReport(user:SessionUser|null|undefined){
  if(!user)return false
  const role=normalize(user.role)
  const department=normalize(typeof user.department==='string'?user.department:user.department?.name)
  return ALLOWED_ROLES.has(role)||ALLOWED_DEPARTMENTS.has(department)
}

export function getValidatedSessionUser(req:{user?:SessionUser;session?:{user?:SessionUser};auth?:{user?:SessionUser}}):SessionUser|null{
  return req.user??req.session?.user??req.auth?.user??null
}

export type SessionUser={
  id?:string|number
  userId?:string|number
  email?:string|null
  role?:string|null
  department?:string|{name?:string|null}|null
  departmentName?:string|null
  profile?:{department?:string|{name?:string|null}|null}|null
}

const ALLOWED_DEPARTMENTS=new Set([
  'finance accounting department',
  'finance accounting',
  'management uma',
  'management kiki',
])

export const normalizeDepartment=(value:unknown)=>String(value??'').trim().replace(/\s+/g,' ').toLowerCase()

function departmentValue(user:SessionUser){
  const direct=typeof user.department==='object'&&user.department!==null?user.department.name:user.department
  const profile=typeof user.profile?.department==='object'&&user.profile.department!==null?user.profile.department.name:user.profile?.department
  return direct??user.departmentName??profile
}

/** The single access policy for Neraca and Laba Rugi. Roles never grant access. */
export function canAccessNeracaAndLabaRugi(user:SessionUser|null|undefined){
  return Boolean(user&&ALLOWED_DEPARTMENTS.has(normalizeDepartment(departmentValue(user))))
}

export function getSessionUser(req:{user?:SessionUser;session?:{user?:SessionUser};auth?:{user?:SessionUser}}):SessionUser|null{
  // These values must be populated by the application's verified server session middleware.
  // Never accept identity/department headers or request input supplied by the browser.
  return req.user??req.session?.user??req.auth?.user??null
}

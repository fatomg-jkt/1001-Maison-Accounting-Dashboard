export type SessionUser={
  id?:string|number
  userId?:string|number
  email?:string|null
  role?:string|null
  department?:string|{name?:string|null}|null
}

const MANAGEMENT_DEPARTMENTS=new Set(['management','management kiki','management uma'])
const normalize=(value:unknown)=>String(value??'').trim().replace(/\s+/g,' ').toLowerCase()

export function canAccessFinancialStatements(user:SessionUser|null|undefined,ownerEmail?:string|null){
  if(!user)return false
  const email=normalize(user.email)
  const department=normalize(typeof user.department==='string'?user.department:user.department?.name)
  return Boolean((email&&email===normalize(ownerEmail))||normalize(user.role)==='owner'||MANAGEMENT_DEPARTMENTS.has(department))
}

export function getSessionUser(req:{user?:SessionUser;session?:{user?:SessionUser};auth?:{user?:SessionUser};headers?:Record<string,string|string[]|undefined>}):SessionUser|null{
  const authenticated=req.user??req.session?.user??req.auth?.user
  if(authenticated)return authenticated
  const header=(name:string)=>{const value=req.headers?.[name];return Array.isArray(value)?value[0]:value}
  const id=header('x-user-id'),email=header('x-user-email'),role=header('x-user-role'),department=header('x-user-department')
  return id||email||role||department?{id,email,role,department}:null
}

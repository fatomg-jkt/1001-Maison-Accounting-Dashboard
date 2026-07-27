export type SessionUser={
  id?:string|number
  userId?:string|number
  email?:string|null
  role?:string|null
  userRole?:string|null
  accountRole?:string|null
  isAdmin?:boolean
  department?:string|{name?:string|null}|null
  departmentName?:string|null
  profile?:{
    email?:string|null
    role?:string|null
    userRole?:string|null
    accountRole?:string|null
    isAdmin?:boolean
    department?:string|{name?:string|null}|null
    departmentName?:string|null
  }|null
}

const ADMIN_ROLES=new Set(['admin','owner','superadmin','super admin'])
const MANAGEMENT_DEPARTMENTS=new Set(['management','management kiki','management uma'])
export const normalizeAccessValue=(value:unknown)=>String(value??'').trim().replace(/\s+/g,' ').toLowerCase()

function departmentValue(user:SessionUser){
  const department=user.department??user.departmentName??user.profile?.department??user.profile?.departmentName
  return typeof department==='string'?department:department?.name
}

export function canAccessNeracaAndLabaRugi(user:SessionUser|null|undefined,adminEmails:string|string[]=[]){
  if(!user)return false
  const role=normalizeAccessValue(user.role??user.userRole??user.accountRole??user.profile?.role??user.profile?.userRole??user.profile?.accountRole)
  const department=normalizeAccessValue(departmentValue(user))
  const email=normalizeAccessValue(user.email??user.profile?.email)
  const configuredEmails=(Array.isArray(adminEmails)?adminEmails:String(adminEmails).split(','))
    .map(normalizeAccessValue)
    .filter(Boolean)
  const isAdmin=user.isAdmin===true||user.profile?.isAdmin===true||ADMIN_ROLES.has(role)
  const isAdminEmail=Boolean(email&&configuredEmails.includes(email))
  const isManagement=MANAGEMENT_DEPARTMENTS.has(department)
  return isAdmin||isAdminEmail||isManagement
}

export function getSessionUser(req:{user?:SessionUser;session?:{user?:SessionUser};auth?:{user?:SessionUser};headers?:Record<string,string|string[]|undefined>}):SessionUser|null{
  const authenticated=req.user??req.session?.user??req.auth?.user
  if(authenticated)return authenticated
  const header=(name:string)=>{const value=req.headers?.[name];return Array.isArray(value)?value[0]:value}
  const id=header('x-user-id'),email=header('x-user-email'),role=header('x-user-role'),department=header('x-user-department'),isAdmin=header('x-user-is-admin')
  return id||email||role||department||isAdmin?{id,email,role,department,isAdmin:normalizeAccessValue(isAdmin)==='true'}:null
}

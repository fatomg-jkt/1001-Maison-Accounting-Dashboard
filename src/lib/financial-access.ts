export type SessionUser={
  id?:string|number|null
  userId?:string|number|null
  email?:string|null
  name?:string|null
  accountName?:string|null
  departmentId?:string|number|null
  departmentName?:string|null
  department?:string|{id?:string|number|null;name?:string|null}|null
  profile?:{
    id?:string|number|null
    email?:string|null
    name?:string|null
    accountName?:string|null
    department?:string|{id?:string|number|null;name?:string|null}|null
    departmentId?:string|number|null
    departmentName?:string|null
  }|null
}

export type FinancialAccessAllowlist={
  ownerUserId?:string|null
  ownerEmail?:string|null
  managementDepartmentIds?:readonly (string|number)[]
}

const OWNER_DISPLAY_NAME='accounting 1001 & maison'
const MANAGEMENT_DEPARTMENTS=new Set(['management kiki','management uma'])
export const normalizeAccessValue=(value:unknown)=>String(value??'').trim().replace(/\s+/g,' ').toLowerCase()

/** The single access policy used by both the browser UI and authenticated server handlers. */
export function canAccessNeracaAndLabaRugi(user:SessionUser|null|undefined,allowlist:FinancialAccessAllowlist={}){
  if(!user)return false
  const userId=normalizeAccessValue(user.id??user.userId??user.profile?.id)
  const email=normalizeAccessValue(user.email??user.profile?.email)
  const accountName=normalizeAccessValue(user.accountName??user.name??user.profile?.accountName??user.profile?.name)
  const departmentValue=user.department??user.profile?.department
  const department=normalizeAccessValue(
    typeof departmentValue==='object'
      ?departmentValue?.name
      :user.departmentName??departmentValue??user.profile?.departmentName,
  )
  const departmentId=normalizeAccessValue(
    user.departmentId??(typeof departmentValue==='object'?departmentValue?.id:undefined)??user.profile?.departmentId,
  )
  const ownerUserId=normalizeAccessValue(allowlist.ownerUserId)
  const ownerEmail=normalizeAccessValue(allowlist.ownerEmail)
  const allowedDepartmentIds=new Set((allowlist.managementDepartmentIds??[]).map(normalizeAccessValue).filter(Boolean))

  const isOwnerAccount=Boolean(
    (ownerUserId&&userId===ownerUserId)||
    (ownerEmail&&email===ownerEmail)||
    (!userId&&!email&&accountName===OWNER_DISPLAY_NAME),
  )
  const isAllowedManagement=Boolean(
    (departmentId&&allowedDepartmentIds.has(departmentId))||MANAGEMENT_DEPARTMENTS.has(department),
  )
  return isOwnerAccount||isAllowedManagement
}

// Backwards-compatible name for code which imported the original helper.
export const canAccessFinancialStatements=canAccessNeracaAndLabaRugi

type AuthenticatedRequest={user?:SessionUser;session?:{user?:SessionUser};auth?:{user?:SessionUser}}

/** Only accepts identity attached by trusted server authentication middleware. */
export function getSessionUser(req:AuthenticatedRequest):SessionUser|null{
  return req.auth?.user??req.session?.user??req.user??null
}

export function financialAccessAllowlistFromEnv(env:Record<string,string|undefined>):FinancialAccessAllowlist{
  return {
    ownerUserId:env.FINANCIAL_REPORT_OWNER_USER_ID,
    ownerEmail:env.FINANCIAL_REPORT_OWNER_EMAIL,
    managementDepartmentIds:[env.MANAGEMENT_UMA_DEPARTMENT_ID,env.MANAGEMENT_KIKI_DEPARTMENT_ID].filter((value):value is string=>Boolean(value)),
  }
}

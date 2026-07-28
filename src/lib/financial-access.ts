export type SessionUser={
  id?:string|number
  userId?:string|number
  email?:string|null
  profile?:{email?:string|null}
  account?:{email?:string|null}
  role?:string|null
  department?:string|{name?:string|null}|null
}

type SessionUserContainer={user?:SessionUser;session?:{user?:SessionUser};data?:{user?:SessionUser}}

export const ALLOWED_FINANCIAL_REPORT_EMAILS=['fat@1001official.com','uma@1001official.com'] as const

export function normalizeEmail(value:unknown){return String(value??'').trim().toLowerCase()}

export function canAccessNeracaAndLabaRugi(user:SessionUser|null|undefined){
  if(!user)return false
  const emails=[user.email,user.profile?.email,user.account?.email].map(normalizeEmail)
  return emails.some(email=>ALLOWED_FINANCIAL_REPORT_EMAILS.some(allowedEmail=>allowedEmail===email))
}

export function getSessionUser(req:{user?:SessionUser;session?:{user?:SessionUser};auth?:SessionUserContainer;data?:{user?:SessionUser}}):SessionUser|null{
  // Only identities attached by the server authentication integration are trusted.
  return req.user??req.session?.user??req.auth?.user??req.auth?.session?.user??req.auth?.data?.user??req.data?.user??null
}

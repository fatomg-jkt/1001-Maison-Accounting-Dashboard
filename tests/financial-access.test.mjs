import assert from 'node:assert/strict'
import test from 'node:test'

import {
  canAccessNeracaAndLabaRugi,
  getSessionUser,
  normalizeEmail,
} from '../src/lib/financial-access.ts'
import {getCurrentUser} from '../src/lib/session.ts'

test('normalizes email before checking financial report access',()=>{
  assert.equal(normalizeEmail('  FAT@1001OFFICIAL.COM  '),'fat@1001official.com')
  assert.equal(canAccessNeracaAndLabaRugi({email:'  FAT@1001OFFICIAL.COM  '}),true)
  assert.equal(canAccessNeracaAndLabaRugi({profile:{email:' UMA@1001OFFICIAL.COM '}}),true)
})

test('denies every email outside the explicit allowlist regardless of role or label',()=>{
  assert.equal(canAccessNeracaAndLabaRugi({email:'other@1001official.com',role:'owner',department:'Management Uma'}),false)
  assert.equal(canAccessNeracaAndLabaRugi(null),false)
})

test('extracts the authenticated user from supported server session shapes',()=>{
  assert.equal(getSessionUser({session:{user:{email:'fat@1001official.com'}}})?.email,'fat@1001official.com')
  assert.equal(getSessionUser({auth:{data:{user:{email:'uma@1001official.com'}}}})?.email,'uma@1001official.com')
})

test('reads the current login email from the dashboard session storage',()=>{
  const values=new Map([['session',JSON.stringify({user:{email:' UMA@1001OFFICIAL.COM '}})]])
  globalThis.window={
    localStorage:{getItem:key=>values.get(key)??null},
    sessionStorage:{getItem:()=>null},
  }
  assert.equal(canAccessNeracaAndLabaRugi(getCurrentUser()),true)
  values.set('session',JSON.stringify({user:{email:'other@1001official.com',role:'owner'}}))
  assert.equal(canAccessNeracaAndLabaRugi(getCurrentUser()),false)
  delete globalThis.window
})

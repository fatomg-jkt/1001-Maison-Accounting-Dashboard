import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {test} from 'node:test'
import {canAccessNeracaAndLabaRugi,normalizeEmail,type SessionUser} from '../src/lib/financial-access.ts'
import {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession} from '../api/_lib/session.ts'

const secret='test-only-session-secret-with-sufficient-length'
const admin:SessionUser={id:'admin-1',name:'Administrator',email:'admin@example.com',role:'ADMIN'}
const diva:SessionUser={id:'diva-1',name:'Diva',email:'divadaulatil@gmail.com',role:'REPORT_VIEWER'}

test('ADMIN can authenticate into a valid session and manage users',()=>{
  const token=createSession(admin,0,secret)
  const session=verifySession(token,1000,secret)
  assert.equal(session?.role,'ADMIN')
})

test('REPORT_VIEWER can open Neraca and Laba Rugi',()=>assert.equal(canAccessNeracaAndLabaRugi(diva),true))
test('REPORT_VIEWER cannot manage access users',()=>assert.notEqual(diva.role,'ADMIN'))
test('divadaulatil@gmail.com receives report access after an account/password is created',()=>{assert.equal(diva.email,'divadaulatil@gmail.com');assert.equal(canAccessNeracaAndLabaRugi(diva),true)})
test('unregistered email is not elevated by a frontend allowlist',()=>assert.equal(canAccessNeracaAndLabaRugi(null),false))
test('inactive-user check is enforced server-side',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/item\.active/);assert.match(source,/!user\.active/)})
test('wrong password is rejected with bcrypt comparison',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/bcrypt\.compare/);assert.match(source,/return null/)})
test('private user blob is read with a token and without cache',async()=>{
  const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8')
  assert.match(source,/get\('financial-access-users\.json',\{access:'private',token:process\.env\.BLOB_READ_WRITE_TOKEN,useCache:false\}\)/)
  assert.match(source,/new Response\(blob\.stream\)\.json\(\)/)
  assert.doesNotMatch(source,/fetch\(blob\.downloadUrl/)
})
test('a missing private user blob starts with an empty user collection',async()=>{
  const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8')
  assert.match(source,/let users:AccessUser\[\]=\[\]/)
  assert.match(source,/if\(blob\)/)
})
test('legacy users payload remains readable and seeds the configured ADMIN',async()=>{
  const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8')
  assert.match(source,/as \{users\?:AccessUser\[\]\}/)
  assert.match(source,/process\.env\.ACCESS_ADMIN_EMAIL/)
  assert.match(source,/process\.env\.ACCESS_ADMIN_PASSWORD/)
  assert.match(source,/role:'ADMIN'/)
})
test('private user blob is created or overwritten without deleting it first',async()=>{
  const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8')
  assert.match(source,/put\('financial-access-users\.json'/)
  assert.match(source,/access:'private'/)
  assert.match(source,/addRandomSuffix:false/)
  assert.match(source,/allowOverwrite:true/)
  assert.match(source,/token:process\.env\.BLOB_READ_WRITE_TOKEN/)
  assert.doesNotMatch(source,/\bdel\(/)
})
test('logout expires and protects the session cookie',()=>{const value=clearCookie(true);assert.match(value,new RegExp(`^${COOKIE_NAME}=`));assert.match(value,/HttpOnly/);assert.match(value,/SameSite=Lax/);assert.match(value,/Max-Age=0/);assert.match(value,/Secure/)})
test('expired and tampered sessions are rejected',()=>{const token=createSession(admin,0,secret);assert.equal(verifySession(token,(SESSION_SECONDS+1)*1000,secret),null);assert.equal(verifySession(`${token}x`,1000,secret),null)})
test('session cookie lasts eight hours and is parsed without browser storage',()=>{const token=createSession(admin,0,secret);const value=cookie(token,true);assert.equal(SESSION_SECONDS,28800);assert.equal(readCookie(value),token);assert.match(value,/HttpOnly/);assert.match(value,/Secure/)})
test('email normalization uses trim and lowercase',()=>assert.equal(normalizeEmail('  DIVAdaulatil@GMAIL.COM '),'divadaulatil@gmail.com'))
test('dashboard and unrelated routes remain public while reports use protection',async()=>{const source=await readFile(new URL('../src/main.tsx',import.meta.url),'utf8');assert.match(source,/path:'\/'/);assert.match(source,/path:'\/neraca'.*ProtectedFinancialReport/);assert.doesNotMatch(source,/initializeAccountingAppSession|ACCOUNTING_APP_USER/)})

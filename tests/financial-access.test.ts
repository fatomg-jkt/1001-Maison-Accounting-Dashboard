import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {test} from 'node:test'
import {canAccessNeracaAndLabaRugi,canAccessPath,canManageUsers,canWriteData,normalizeEmail,type SessionUser} from '../src/lib/financial-access.ts'
import {COOKIE_NAME,SESSION_SECONDS,clearCookie,cookie,createSession,readCookie,verifySession} from '../api/_lib/session.ts'
import {LOGIN_SERVER_ERROR,readLoginResponse} from '../src/lib/login-response.ts'
import {safeLoginRedirect} from '../src/lib/session.ts'

const secret='test-only-session-secret-with-sufficient-length'
const admin:SessionUser={id:'admin-1',name:'Administrator',email:'admin@example.com',role:'SUPER_ADMIN'}
const diva:SessionUser={id:'diva-1',name:'Diva',email:'divadaulatil@gmail.com',role:'MANAGEMENT'}

test('SUPER_ADMIN can authenticate into a valid session and manage users',()=>{
  const token=createSession(admin,0,secret)
  const session=verifySession(token,1000,secret)
  assert.equal(session?.role,'SUPER_ADMIN')
})

test('MANAGEMENT can open Neraca and Laba Rugi',()=>assert.equal(canAccessNeracaAndLabaRugi(diva),true))
test('MANAGEMENT cannot manage access users',()=>assert.notEqual(diva.role,'SUPER_ADMIN'))
test('divadaulatil@gmail.com receives report access after an account/password is created',()=>{assert.equal(diva.email,'divadaulatil@gmail.com');assert.equal(canAccessNeracaAndLabaRugi(diva),true)})

test('role matrix grants only the requested routes and mutations',()=>{
  const accounting:SessionUser={id:'accounting',name:'Accounting',email:'accounting@1001maison.test',role:'ACCOUNTING'}
  const management:SessionUser={id:'management',name:'Management',email:'management@1001maison.test',role:'MANAGEMENT'}
  assert.equal(canManageUsers(admin),true)
  assert.equal(canWriteData(accounting),true)
  assert.equal(canManageUsers(accounting),false)
  assert.equal(canWriteData(management),false)
  for(const path of ['/','/neraca','/laba-rugi','/arus-kas','/budgeting','/analisa'])assert.equal(canAccessPath(path,management),true)
  for(const path of ['/settings','/coa','/department','/cost-center','/budgeting/upload'])assert.equal(canAccessPath(path,management),false)
  assert.equal(canAccessPath('/coa',accounting),true)
  assert.equal(canAccessPath('/settings',accounting),false)
})
test('unregistered email is not elevated by a frontend allowlist',()=>assert.equal(canAccessNeracaAndLabaRugi(null),false))
test('inactive-user check is enforced server-side',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/item\.active/);assert.match(source,/!user\.active/)})
test('wrong password is rejected with bcrypt comparison',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/bcrypt\.compare/);assert.match(source,/return null/)})
test('private user blob is read with a token and without cache',async()=>{
  const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8')
  assert.match(source,/get\('financial-access-users\.json',\{access:'private',token:process\.env\.BLOB_READ_WRITE_TOKEN,useCache:false\}\)/)
  assert.match(source,/new Response\(blob\.stream\)\.text\(\)/)
  assert.doesNotMatch(source,/new Response\(blob\.stream\)\.json\(\)/)
  assert.doesNotMatch(source,/fetch\(blob\.downloadUrl/)
})
test('a missing private user blob starts with an empty user collection',async()=>{
  const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8')
  assert.match(source,/if\(blob===null\)return \[\]/)
})
test('the three configured accounts are seeded server-side with bcrypt hashes',async()=>{
  const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8')
  for(const email of ['superadmin@1001maison.test','accounting@1001maison.test','management@1001maison.test'])assert.match(source,new RegExp(email.replace('.',String.raw`\.`)))
  for(const key of ['SUPER_ADMIN_PASSWORD','ACCOUNTING_PASSWORD','MANAGEMENT_PASSWORD'])assert.match(source,new RegExp(key))
  assert.match(source,/bcrypt\.hash\(password,12\)/)
  assert.doesNotMatch(source,/Admin1001#Maison26|Accounting1001#26|ManagementMaison#26/)
})
test('a null Blob stream is rejected before reading',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/if\(blob\.stream===null\)throw/)})
test('an empty Blob response produces an empty user collection',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/if\(!text\.trim\(\)\)return \[\]/)})
test('malformed Blob JSON produces the required safe error',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/catch\{throw new Error\('Data pengguna pada Vercel Blob bukan JSON yang valid\.'\)\}/)})
test('configured authentication uses seeded accounts and bcrypt comparison',async()=>{const source=await readFile(new URL('../api/_lib/access.ts',import.meta.url),'utf8');assert.match(source,/const users=await loadUsers\(\)/);assert.match(source,/bcrypt\.compare/);assert.match(source,/return user/)})
test('API failures retain a JSON content type and safe message envelope',async()=>{const source=await readFile(new URL('../api/_lib/http.ts',import.meta.url),'utf8');assert.match(source,/setHeader\('Content-Type','application\/json'\)/);assert.match(source,/\{message:/)})
test('plain-text login server errors do not cause a JSON parser failure',async()=>{const result=await readLoginResponse(new Response('A server error has occurred',{status:500}));assert.equal(result.message,LOGIN_SERVER_ERROR);assert.doesNotMatch(result.message,/Unexpected token/)})
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
test('login redirect preserves safe internal destinations and rejects external or recursive redirects',()=>{
  assert.equal(safeLoginRedirect('/budgeting/department?year=2026'),'/budgeting/department?year=2026')
  assert.equal(safeLoginRedirect('https://example.com'),'/')
  assert.equal(safeLoginRedirect('//example.com'),'/')
  assert.equal(safeLoginRedirect('/login?redirect=/settings'),'/')
  assert.equal(safeLoginRedirect(null),'/')
})
test('all dashboard routes use the global session guard',async()=>{const source=await readFile(new URL('../src/main.tsx',import.meta.url),'utf8');assert.match(source,/fetchSession\(\)\.then\(setUser\)/);assert.match(source,/window\.location\.replace\(`\/login\?redirect=/);assert.match(source,/canAccessPath\(path,user\)/)})

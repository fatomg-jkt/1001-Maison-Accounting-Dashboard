import assert from 'node:assert/strict'
import {afterEach,test} from 'node:test'
import {canAccessNeracaAndLabaRugi} from '../src/lib/financial-access.ts'
import {getCurrentUser} from '../src/lib/session.ts'

class MemoryStorage{
  #values=new Map<string,string>()
  getItem(key:string){return this.#values.get(key)??null}
  setItem(key:string,value:string){this.#values.set(key,String(value))}
  removeItem(key:string){this.#values.delete(key)}
  clear(){this.#values.clear()}
  key(index:number){return [...this.#values.keys()][index]??null}
  get length(){return this.#values.size}
}

const browser={localStorage:new MemoryStorage(),sessionStorage:new MemoryStorage()} as unknown as Window
Object.defineProperty(globalThis,'window',{value:browser,configurable:true})

afterEach(()=>{
  browser.localStorage.clear()
  browser.sessionStorage.clear()
  delete browser.__USER__
  delete browser.__SESSION__
})

test('allows all approved financial report emails while rejecting another email',()=>{
  for(const email of ['fat@1001official.com','uma@1001official.com','hannabeforeafter@gmail.com','finance@obsidian-managementgroup.com','hapsariuma@gmail.com','divadaulatil@gmail.com']){
    assert.equal(canAccessNeracaAndLabaRugi({email}),true)
  }
  assert.equal(canAccessNeracaAndLabaRugi({email:'other@example.com'}),false)
})

test('normalizes and checks all supported user email locations',()=>{
  assert.equal(canAccessNeracaAndLabaRugi({email:'  FAT@1001OFFICIAL.COM '}),true)
  assert.equal(canAccessNeracaAndLabaRugi({profile:{email:'UMA@1001OFFICIAL.COM'}}),true)
  assert.equal(canAccessNeracaAndLabaRugi({account:{email:'HANNABEFOREAFTER@GMAIL.COM'}}),true)
  assert.equal(canAccessNeracaAndLabaRugi({session:{email:'fat@1001official.com'}}),true)
})

test('resolves supported nested session shapes from localStorage',()=>{
  const shapes=[
    {email:'hannabeforeafter@gmail.com'},
    {user:{email:'hannabeforeafter@gmail.com'}},
    {session:{user:{email:'hannabeforeafter@gmail.com'}}},
    {data:{user:{email:'hannabeforeafter@gmail.com'}}},
    {profile:{email:'hannabeforeafter@gmail.com'}},
    {account:{email:'hannabeforeafter@gmail.com'}},
  ]
  for(const [index,shape] of shapes.entries()){
    browser.localStorage.clear()
    browser.localStorage.setItem(['user','session','auth','currentUser'][index%4],JSON.stringify(shape))
    assert.equal(getCurrentUser()?.email,'hannabeforeafter@gmail.com')
  }
})

test('resolves a nested user from sessionStorage',()=>{
  browser.sessionStorage.setItem('auth',JSON.stringify({data:{user:{email:' DIVADAULATIL@GMAIL.COM '}}}))
  const user=getCurrentUser()
  assert.equal(user?.email,'divadaulatil@gmail.com')
  assert.equal(canAccessNeracaAndLabaRugi(user),true)
})

test('resolves window user and top-level or nested window session',()=>{
  browser.__USER__={profile:{email:'fat@1001official.com'}}
  assert.equal(getCurrentUser()?.email,'fat@1001official.com')
  delete browser.__USER__
  browser.__SESSION__={email:'uma@1001official.com'}
  assert.equal(getCurrentUser()?.email,'uma@1001official.com')
  browser.__SESSION__={user:{email:'hannabeforeafter@gmail.com'}}
  assert.equal(getCurrentUser()?.email,'hannabeforeafter@gmail.com')
})

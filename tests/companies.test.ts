import test from 'node:test'
import assert from 'node:assert/strict'
import {ALL_COMPANIES,companyOptions,isCompanyId,matchesCompanyFilter,migrateLegacyCompany} from '../src/lib/companies.ts'

const expected = [
  'Semua Perusahaan',
  '1001',
  'CV. Sepuluh Januari Sukses',
  'PT. Mimama Laku Selalu',
  'CV. Seribu Toko Sukses',
  'CV. Event Seribu Satu',
  'CV. Maison Yvan Indonesia',
]

test('company master exposes the required options in order',()=>{
  assert.deepEqual(companyOptions.map(option=>option.label),expected)
  assert.equal(companyOptions.some(option=>option.value==='Maison'),false)
})

test('1001 is an active company while legacy Maison is renamed',()=>{
  assert.equal(migrateLegacyCompany('Maison'),'CV. Maison Yvan Indonesia')
  assert.equal(migrateLegacyCompany('1001'),'1001')
  assert.equal(isCompanyId('CV. Seribu Toko Sukses'),true)
  assert.equal(isCompanyId('1001'),true)
})

test('all-company consolidation includes 1001 while a specific filter isolates it',()=>{
  assert.equal(matchesCompanyFilter('1001',ALL_COMPANIES),true)
  assert.equal(matchesCompanyFilter('1001','1001'),true)
  assert.equal(matchesCompanyFilter('CV. Sepuluh Januari Sukses','1001'),false)
})

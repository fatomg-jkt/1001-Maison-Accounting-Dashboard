import test from 'node:test'
import assert from 'node:assert/strict'
import {companyOptions,isCompanyId,migrateLegacyCompany} from '../src/lib/companies.ts'

const expected = [
  'Semua Perusahaan',
  'CV. Sepuluh Januari Sukses',
  'PT. Mimama Laku Selalu',
  'CV. Seribu Toko Sukses',
  'CV. Event Seribu Satu',
  'CV. Maison Yvan Indonesia',
]

test('company master exposes the required options in order',()=>{
  assert.deepEqual(companyOptions.map(option=>option.label),expected)
  assert.equal(companyOptions.some(option=>option.value==='1001'||option.value==='Maison'),false)
})

test('legacy Maison is renamed while legacy 1001 is preserved for migration review',()=>{
  assert.equal(migrateLegacyCompany('Maison'),'CV. Maison Yvan Indonesia')
  assert.equal(migrateLegacyCompany('1001'),'1001')
  assert.equal(isCompanyId('CV. Seribu Toko Sukses'),true)
  assert.equal(isCompanyId('1001'),false)
})

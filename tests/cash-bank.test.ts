import assert from 'node:assert/strict'
import test from 'node:test'
import {validateCashBankRows} from '../src/lib/cash-bank-validation.ts'
import {toCashBankPayload} from '../src/lib/cash-bank-import.ts'
import {isMissingBlob} from '../api/_lib/cash-bank-store.ts'

test('accepts the seven-column cash and bank template payload',()=>{
  const result=validateCashBankRows([{company:'CV. Sepuluh Januari Sukses',month:'Januari',year:2026,bankName:'BCA',currency:'idr',endingBalance:125000000,description:'Operasional',department_id:'Semua Department',cost_center_id:'Semua Cost Center'}])
  assert.deepEqual(result.errors,[])
  assert.equal(result.rows[0].currency,'IDR')
  assert.equal(result.rows[0].endingBalance,125000000)
  assert.equal('department_id' in result.rows[0],false)
  assert.equal('cost_center_id' in result.rows[0],false)
})

test('returns clear errors for invalid required cash and bank values',()=>{
  const result=validateCashBankRows([{company:'',month:'Jan',year:26,bankName:'',currency:'Rupiah',endingBalance:'bukan angka'}])
  assert.equal(result.errors.length,6)
  assert.match(result.errors.join(' '),/Perusahaan wajib diisi/)
  assert.match(result.errors.join(' '),/Saldo Akhir harus berupa angka/)
})

test('maps preview columns to a normalized API payload',()=>{
  const [row]=toCashBankPayload([{Perusahaan:' CV. Sepuluh Januari Sukses ',Bulan:'Januari',Tahun:'2026','Nama Bank':' OCBC NISP ','Mata Uang':'idr','Saldo Akhir':93624508,Keterangan:''}])
  assert.deepEqual(row,{company:'CV. Sepuluh Januari Sukses',month:'Januari',year:2026,bankName:'OCBC NISP',currency:'IDR',endingBalance:93624508,description:''})
})

test('recognizes an absent first-use Blob object as empty storage',()=>{
  const missing=new Error('Blob not found')
  missing.name='BlobNotFoundError'
  assert.equal(isMissingBlob(missing),true)
  assert.equal(isMissingBlob(new Error('Blob access denied')),false)
})

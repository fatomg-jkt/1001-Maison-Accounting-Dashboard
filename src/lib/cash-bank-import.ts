export type CashBankImportRow=Record<string,unknown>

export function toCashBankPayload(rows:CashBankImportRow[]){
  return rows.map(row=>({
    company:String(row.Perusahaan??'').trim(),
    month:String(row.Bulan??'').trim(),
    year:Number(row.Tahun),
    bankName:String(row['Nama Bank']??'').trim(),
    currency:String(row['Mata Uang']??'').trim().toUpperCase(),
    endingBalance:Number(row['Saldo Akhir']),
    description:String(row.Keterangan??'').trim()
  }))
}

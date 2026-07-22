export const monthly = [
  {month:'Jan',revenue:4820,expense:3470,profit:1350,cash:920},{month:'Feb',revenue:5150,expense:3650,profit:1500,cash:1040},{month:'Mar',revenue:4980,expense:3590,profit:1390,cash:980},{month:'Apr',revenue:5560,expense:3810,profit:1750,cash:1210},{month:'Mei',revenue:5830,expense:3990,profit:1840,cash:1350},{month:'Jun',revenue:6240,expense:4160,profit:2080,cash:1490},
]
export const kpis = [
  {label:'Total Asset',value:24850000000,change:8.4},{label:'Total Liabilitas',value:9360000000,change:-2.1},{label:'Total Ekuitas',value:15490000000,change:5.8},{label:'Pendapatan',value:6240000000,change:12.6},
  {label:'Beban',value:4160000000,change:4.3},{label:'Laba Bersih',value:2080000000,change:16.8},{label:'Kas & Bank',value:5480000000,change:7.2},{label:'Piutang',value:3920000000,change:-3.5},{label:'Persediaan',value:2860000000,change:2.9},{label:'Hutang Usaha',value:3140000000,change:-1.7},
]
export const assetMix=[{name:'Kas & Bank',value:22},{name:'Piutang',value:16},{name:'Persediaan',value:12},{name:'Aset Tetap',value:38},{name:'Lainnya',value:12}]
export const liabilityMix=[{name:'Hutang Usaha',value:34},{name:'Hutang Pajak',value:14},{name:'Jangka Panjang',value:39},{name:'Lainnya',value:13}]
export const departments=[{name:'Operasional',value:1480},{name:'Marketing',value:960},{name:'General Affairs',value:720},{name:'Human Capital',value:590},{name:'IT',value:410}]
export const accounts=[{name:'Beban Bahan Baku',type:'Beban',value:865000000},{name:'Beban Gaji',type:'Beban',value:620000000},{name:'Beban Pemasaran',type:'Beban',value:435000000},{name:'Pendapatan Retail',type:'Pendapatan',value:2450000000},{name:'Pendapatan Wholesale',type:'Pendapatan',value:1820000000},{name:'Pendapatan Online',type:'Pendapatan',value:1470000000}]
export const balanceRows=[
 {label:'ASSET',kind:'title'},{label:'Asset Lancar',kind:'section'},{label:'Kas',value:1580000000},{label:'Bank',value:3900000000},{label:'Piutang',value:3920000000},{label:'Persediaan',value:2860000000},{label:'Uang Muka',value:430000000},{label:'Pajak Dibayar Dimuka',value:310000000},{label:'Total Asset Lancar',value:13000000000,kind:'total'},
 {label:'Asset Tidak Lancar',kind:'section'},{label:'Aset Tetap',value:12800000000},{label:'Akumulasi Penyusutan',value:-2350000000},{label:'Investasi',value:860000000},{label:'Asset Lainnya',value:540000000},{label:'Total Asset Tidak Lancar',value:11850000000,kind:'total'},{label:'TOTAL ASSET',value:24850000000,kind:'grand'},
 {label:'LIABILITAS',kind:'title'},{label:'Liabilitas Jangka Pendek',kind:'section'},{label:'Hutang Usaha',value:3140000000},{label:'Hutang Pajak',value:840000000},{label:'Hutang Gaji',value:470000000},{label:'Hutang Lainnya',value:650000000},{label:'Total Liabilitas Lancar',value:5100000000,kind:'total'},{label:'Liabilitas Jangka Panjang',value:4260000000,kind:'section'},{label:'TOTAL LIABILITAS',value:9360000000,kind:'grand'},
 {label:'EKUITAS',kind:'title'},{label:'Modal',value:10000000000},{label:'Laba Ditahan',value:3410000000},{label:'Laba Tahun Berjalan',value:2080000000},{label:'TOTAL EKUITAS',value:15490000000,kind:'grand'},{label:'TOTAL LIABILITAS + EKUITAS',value:24850000000,kind:'grand'},
]
export const incomeRows=[{label:'PENDAPATAN',kind:'title'},{label:'Pendapatan Operasional',value:5780000000},{label:'Pendapatan Lain-lain',value:460000000},{label:'TOTAL PENDAPATAN',value:6240000000,kind:'grand'},{label:'Harga Pokok Penjualan',value:-2480000000},{label:'LABA KOTOR',value:3760000000,kind:'grand'},{label:'Beban Operasional',kind:'title'},{label:'Beban Administrasi',value:-620000000},{label:'Beban Penjualan',value:-540000000},{label:'Beban Umum',value:-310000000},{label:'TOTAL BEBAN',value:-1470000000,kind:'total'},{label:'LABA OPERASI',value:2290000000,kind:'grand'},{label:'Pendapatan/Beban Lain',value:90000000},{label:'LABA SEBELUM PAJAK',value:2380000000,kind:'grand'},{label:'Pajak',value:-300000000},{label:'LABA BERSIH',value:2080000000,kind:'grand'}]

export type BudgetCompany='1001'|'Maison'
export type BudgetMonth='Januari'|'Februari'|'Maret'|'April'|'Mei'|'Juni'|'Juli'|'Agustus'|'September'|'Oktober'|'November'|'Desember'
export type BudgetRow={company:BudgetCompany;tahun:number;bulan:BudgetMonth;department:string;costCenter:string;kodeAkun:string;namaAkun:string;kategoriAkun:string;budget:number;actual:number}
export const budgetRows:BudgetRow[]=[
 {company:'1001',tahun:2026,bulan:'Juni',department:'Operasional',costCenter:'OPS-01',kodeAkun:'6101',namaAkun:'Beban Bahan Baku',kategoriAkun:'COGS',budget:920000000,actual:875000000},
 {company:'1001',tahun:2026,bulan:'Juni',department:'Marketing',costCenter:'MKT-01',kodeAkun:'6201',namaAkun:'Iklan Digital',kategoriAkun:'OPEX',budget:350000000,actual:382000000},
 {company:'1001',tahun:2026,bulan:'Juni',department:'General Affairs',costCenter:'GA-01',kodeAkun:'6301',namaAkun:'Sewa Kantor',kategoriAkun:'OPEX',budget:210000000,actual:174000000},
 {company:'1001',tahun:2026,bulan:'Juni',department:'Human Capital',costCenter:'HC-01',kodeAkun:'6401',namaAkun:'Gaji & Benefit',kategoriAkun:'OPEX',budget:480000000,actual:395000000},
 {company:'1001',tahun:2026,bulan:'Juni',department:'IT',costCenter:'IT-01',kodeAkun:'6501',namaAkun:'Lisensi Software',kategoriAkun:'OPEX',budget:110000000,actual:132000000},
 {company:'Maison',tahun:2026,bulan:'Juni',department:'Operasional',costCenter:'OPS-02',kodeAkun:'6101',namaAkun:'Beban Bahan Baku',kategoriAkun:'COGS',budget:1050000000,actual:820000000},
 {company:'Maison',tahun:2026,bulan:'Juni',department:'Marketing',costCenter:'MKT-02',kodeAkun:'6202',namaAkun:'Event & Promotion',kategoriAkun:'OPEX',budget:290000000,actual:268000000},
 {company:'Maison',tahun:2026,bulan:'Juni',department:'General Affairs',costCenter:'GA-02',kodeAkun:'6302',namaAkun:'Utility',kategoriAkun:'OPEX',budget:165000000,actual:172000000},
 {company:'Maison',tahun:2026,bulan:'Juni',department:'Human Capital',costCenter:'HC-02',kodeAkun:'6402',namaAkun:'Training',kategoriAkun:'OPEX',budget:85000000,actual:52000000},
 {company:'Maison',tahun:2026,bulan:'Juni',department:'IT',costCenter:'IT-02',kodeAkun:'6502',namaAkun:'Cloud Infrastructure',kategoriAkun:'OPEX',budget:145000000,actual:116000000},
 {company:'1001',tahun:2026,bulan:'Mei',department:'Operasional',costCenter:'OPS-01',kodeAkun:'6101',namaAkun:'Beban Bahan Baku',kategoriAkun:'COGS',budget:880000000,actual:790000000},
 {company:'Maison',tahun:2026,bulan:'Mei',department:'Marketing',costCenter:'MKT-02',kodeAkun:'6202',namaAkun:'Event & Promotion',kategoriAkun:'OPEX',budget:260000000,actual:231000000}
]
export const budgetMonthly=[
 {month:'Jan',budget:2650,actual:2110,remaining:540},{month:'Feb',budget:2720,actual:2290,remaining:430},{month:'Mar',budget:2840,actual:2510,remaining:330},{month:'Apr',budget:2920,actual:2680,remaining:240},{month:'Mei',budget:3020,actual:2850,remaining:170},{month:'Jun',budget:3805,actual:3386,remaining:419},
]
export const budgetService={
 filter(company:'all'|'pt-1001'|'pt-maison'='all'){return budgetRows.filter(r=>company==='all'||(company==='pt-1001'?r.company==='1001':r.company==='Maison'))},
 monthly(){return budgetMonthly},
 status(row:BudgetRow){const pct=row.budget?row.actual/row.budget*100:0;return pct>100?'Over Budget':pct>=80?'Perhatian':'Aman'},
 realization(row:BudgetRow){return row.budget?row.actual/row.budget*100:0}
}


export type ManualReportPayload={reportType:'Neraca'|'Laba Rugi'|'Neraca dan Laba Rugi'|'balance_sheet'|'profit_loss';company:'1001'|'Maison';month:string;year:number;uploadMode:string;source:'manual'|'excel'|'accurate';syncedAt?:string;accountCount?:number;rows:{accountCode:string;accountName:string;accountType?:string;category:string;subcategory:string;amount:number}[]}
export const reportDataHistory:{company:string;period:string;reportType:string;rowCount:number;totalAmount:number;inputDate:string;source:'Manual'|'Upload Excel'|'Accurate'}[]=[]
export const reportDataService={
 save(payload:ManualReportPayload){
  reportDataHistory.unshift({company:payload.company,period:`${payload.month} ${payload.year}`,reportType:payload.reportType==='balance_sheet'?'Neraca':payload.reportType==='profit_loss'?'Laba Rugi':payload.reportType,rowCount:payload.rows.length,totalAmount:payload.rows.reduce((a,b)=>a+b.amount,0),inputDate:new Date().toISOString(),source:payload.source==='accurate'?'Accurate':payload.source==='manual'?'Manual':'Upload Excel'})
  return Promise.resolve({ok:true,payload})
 },
 history(){return reportDataHistory}
}

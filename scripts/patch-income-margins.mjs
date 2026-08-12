import fs from 'node:fs'

const path='src/main.tsx'
let source=fs.readFileSync(path,'utf8')

function replaceOnce(label,from,to){
  if(source.includes(to))return
  if(!source.includes(from))throw new Error(`[patch-income-margins] Target not found: ${label}`)
  source=source.replace(from,to)
}

replaceOnce(
  'margin helpers',
  "const pctChange=(current:number,previous:number)=>previous===0?null:(current-previous)/previous*100",
  "const pctChange=(current:number,previous:number)=>previous===0?null:(current-previous)/previous*100\nconst incomeCategoryTotal=(rows:StoredReportRow[],category:string)=>rowSum(rows,row=>row.category===category)\nconst profitMargins=(rows:StoredReportRow[])=>{const revenue=incomeCategoryTotal(rows,'Pendapatan'),hpp=incomeCategoryTotal(rows,'HPP'),opex=incomeCategoryTotal(rows,'Beban Operasional'),otherIncome=incomeCategoryTotal(rows,'Pendapatan Lain-lain'),otherExpense=incomeCategoryTotal(rows,'Beban Lain-lain'),tax=incomeCategoryTotal(rows,'Pajak');const grossProfit=revenue-hpp,operatingProfit=grossProfit-opex,netProfit=operatingProfit+otherIncome-otherExpense-tax;const margin=(profit:number)=>revenue===0?null:profit/revenue*100;return {gross:margin(grossProfit),operating:margin(operatingProfit),net:margin(netProfit)}}\nconst marginDelta=(current:number|null,previous:number|null)=>current===null||previous===null?null:current-previous\nconst formatMargin=(value:number|null)=>value===null?'N/A':`${value.toLocaleString('id-ID',{minimumFractionDigits:1,maximumFractionDigits:1})}%`"
)

replaceOnce(
  'current and previous margins',
  "const prevRevenue=incomeRevenue(prevIncome),prevExpense=incomeExpense(prevIncome),prevProfit=prevRevenue-prevExpense;const asset=",
  "const prevRevenue=incomeRevenue(prevIncome),prevExpense=incomeExpense(prevIncome),prevProfit=prevRevenue-prevExpense;const margins=profitMargins(incomeStored),prevMargins=profitMargins(prevIncome);const asset="
)

replaceOnce(
  'return income margins',
  "insights:{profitChange:pctChange(current.netProfit,previousValues.netProfit),expenseChange:pctChange(current.expense,previousValues.expense),cash:current.cash,hasPreviousIncome:prevIncome.length>0,hasPreviousBalance:prevBalance.length>0},hasBalanceData:",
  "insights:{profitChange:pctChange(current.netProfit,previousValues.netProfit),expenseChange:pctChange(current.expense,previousValues.expense),cash:current.cash,hasPreviousIncome:prevIncome.length>0,hasPreviousBalance:prevBalance.length>0},incomeMargins:{...margins,grossChange:prevIncome.length?marginDelta(margins.gross,prevMargins.gross):null,operatingChange:prevIncome.length?marginDelta(margins.operating,prevMargins.operating):null,netChange:prevIncome.length?marginDelta(margins.net,prevMargins.net):null},hasBalanceData:"
)

replaceOnce(
  'export summary margins',
  "summary:type==='balance'?[{kpi:'Total Aset',nilai:companyData.balanceTotals.asset},{kpi:'Total Liabilitas',nilai:companyData.balanceTotals.liability},{kpi:'Total Ekuitas',nilai:companyData.balanceTotals.equity},{kpi:'Selisih Neraca',nilai:companyData.balanceTotals.difference},{kpi:'Status Neraca',nilai:balanceStatus?'Seimbang':'Tidak seimbang'}]:[{kpi:'Gross Profit Margin',nilai:'60,3%'},{kpi:'Operating Margin',nilai:'36,7%'},{kpi:'Net Profit Margin',nilai:'33,3%'}]",
  "summary:type==='balance'?[{kpi:'Total Aset',nilai:companyData.balanceTotals.asset},{kpi:'Total Liabilitas',nilai:companyData.balanceTotals.liability},{kpi:'Total Ekuitas',nilai:companyData.balanceTotals.equity},{kpi:'Selisih Neraca',nilai:companyData.balanceTotals.difference},{kpi:'Status Neraca',nilai:balanceStatus?'Seimbang':'Tidak seimbang'}]:[{kpi:'Gross Profit Margin',nilai:formatMargin(companyData.incomeMargins.gross)},{kpi:'Operating Margin',nilai:formatMargin(companyData.incomeMargins.operating)},{kpi:'Net Profit Margin',nilai:formatMargin(companyData.incomeMargins.net)}]"
)

replaceOnce(
  'margin cards',
  "{type==='income'&&hasData&&<div className=\"grid sm:grid-cols-3 gap-3\">{[['Gross Profit Margin','60,3%'],['Operating Margin','36,7%'],['Net Profit Margin','33,3%']].map(x=><div key={x[0]} className=\"card p-4\"><span className=\"label\">{x[0]}</span><div className=\"text-2xl font-bold text-navy-900 mt-2\">{x[1]}</div><span className=\"text-[10px] text-emerald-600\">↑ 2,4% vs bulan lalu</span></div>)}</div>}",
  "{type==='income'&&hasData&&<div className=\"grid sm:grid-cols-3 gap-3\">{[{label:'Gross Profit Margin',value:companyData.incomeMargins.gross,change:companyData.incomeMargins.grossChange},{label:'Operating Margin',value:companyData.incomeMargins.operating,change:companyData.incomeMargins.operatingChange},{label:'Net Profit Margin',value:companyData.incomeMargins.net,change:companyData.incomeMargins.netChange}].map(x=><div key={x.label} className=\"card p-4\"><span className=\"label\">{x.label}</span><div className=\"text-2xl font-bold text-navy-900 mt-2\">{formatMargin(x.value)}</div><span className={`text-[10px] ${x.change===null?'text-slate-500':x.change>=0?'text-emerald-600':'text-red-600'}`}>{x.change===null?'N/A vs bulan lalu':`${x.change>=0?'↑':'↓'} ${Math.abs(x.change).toLocaleString('id-ID',{minimumFractionDigits:1,maximumFractionDigits:1})} pp vs bulan lalu`}</span></div>)}</div>}"
)

fs.writeFileSync(path,source)
console.log('[patch-income-margins] Profit margin cards now use period data')

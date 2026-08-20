export type CashBankRow={id:string;company:string;month:string;year:number;bankName:string;currency:string;endingBalance:number;description?:string;accountNumber?:string;createdAt:string;updatedAt:string}
export type BankStatement={id:string;company:string;month:string;year:number;bankName:string;bankAccountId?:string;accountNumber?:string;description?:string;fileName:string;contentType:string;size:number;blobPath:string;uploadedAt:string;uploadedBy:{id:string;name:string;email:string}}

async function readJson<T>(path:string,fallback:T):Promise<T>{
  const {get}=await import('@vercel/blob')
  const result=await get(path,{access:'private',useCache:false})
  if(!result?.stream)return fallback
  const text=await new Response(result.stream).text()
  return text.trim()?JSON.parse(text) as T:fallback
}

async function writeJson(path:string,value:unknown){
  const {put}=await import('@vercel/blob')
  await put(path,JSON.stringify(value,null,2),{
    access:'private',
    addRandomSuffix:false,
    allowOverwrite:true,
    contentType:'application/json'
  })
}

export const loadCashBankRows=()=>readJson<CashBankRow[]>('cash-bank/accounts.json',[])
export const saveCashBankRows=(rows:CashBankRow[])=>writeJson('cash-bank/accounts.json',rows)
export const loadStatements=()=>readJson<BankStatement[]>('cash-bank/statements.json',[])
export const saveStatements=(rows:BankStatement[])=>writeJson('cash-bank/statements.json',rows)

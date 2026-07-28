export const LOGIN_SERVER_ERROR='Server login mengalami error. Periksa Runtime Logs Vercel.'

export async function readLoginResponse(response:Response):Promise<{message?:string;user?:unknown}>{
  const text=await response.text()
  try{const data=JSON.parse(text) as unknown;if(data&&typeof data==='object')return data as {message?:string;user?:unknown}}
  catch{/* Platform error pages are deliberately replaced with a safe message. */}
  return {message:LOGIN_SERVER_ERROR}
}

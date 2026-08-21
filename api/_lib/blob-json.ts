export function blobToken(){
  const token=process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if(!token)throw new Error('Konfigurasi Blob belum lengkap: BLOB_READ_WRITE_TOKEN tidak tersedia.')
  return token
}

export function missingBlob(error:unknown){
  return error instanceof Error&&(error.name==='BlobNotFoundError'||/blob.*not found|not found.*blob/i.test(error.message))
}

export async function readBlobJson<T>(path:string,fallback:T):Promise<T>{
  try{
    const {get}=await import('@vercel/blob')
    const blob=await get(path,{access:'private',useCache:false,token:blobToken()})
    if(!blob?.stream)return fallback
    const text=await new Response(blob.stream).text()
    return text.trim()?JSON.parse(text) as T:fallback
  }catch(error){if(missingBlob(error))return fallback;throw error}
}

export async function writeBlobJson(path:string,value:unknown){
  const {put}=await import('@vercel/blob')
  await put(path,JSON.stringify(value,null,2),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json',token:blobToken()})
}

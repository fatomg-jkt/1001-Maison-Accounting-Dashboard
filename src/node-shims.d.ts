declare const process:{env:Record<string,string|undefined>}
declare module 'node:crypto'{const crypto:{randomUUID:()=>string;createHmac:(algorithm:string,key:string)=>{update:(data:string)=>{digest:(encoding:'hex'|'base64url')=>string}}};export default crypto}
declare const Buffer:{from:(value:string,encoding?:string)=>{toString:(encoding?:string)=>string}}
declare module 'bcryptjs'{const bcrypt:{hash:(value:string,rounds:number)=>Promise<string>;compare:(value:string,hash:string)=>Promise<boolean>};export default bcrypt}
declare module '@vercel/blob'{export const list:(options:Record<string,unknown>)=>Promise<{blobs:Array<{pathname:string;url:string;downloadUrl:string}>}>;export const get:(pathname:string,options:Record<string,unknown>)=>Promise<{stream:BodyInit}|null>;export const put:(pathname:string,data:string,options:Record<string,unknown>)=>Promise<unknown>;export const del:(url:string,options:Record<string,unknown>)=>Promise<void>}

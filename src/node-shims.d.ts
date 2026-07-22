declare const process:{env:Record<string,string|undefined>}
declare module 'node:crypto'{const crypto:{createHmac:(algorithm:string,key:string)=>{update:(data:string)=>{digest:(encoding:'hex')=>string}}};export default crypto}

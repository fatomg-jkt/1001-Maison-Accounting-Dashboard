/* eslint-disable @typescript-eslint/no-explicit-any */
import {canAccessNeracaAndLabaRugi,financialAccessAllowlistFromEnv,getSessionUser} from '../src/lib/financial-access.js'

export default function handler(req:any,res:any){
  const allowed=canAccessNeracaAndLabaRugi(getSessionUser(req),financialAccessAllowlistFromEnv(process.env))
  res.statusCode=200
  res.setHeader('Content-Type','application/json')
  res.setHeader('Cache-Control','private, no-store')
  res.end(JSON.stringify({allowed}))
}

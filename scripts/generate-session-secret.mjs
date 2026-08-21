import {randomBytes} from 'node:crypto'
import {mkdir,writeFile} from 'node:fs/promises'

await mkdir('api/_lib',{recursive:true})
const secret=randomBytes(48).toString('base64url')
await writeFile('api/_lib/generated-session-secret.ts',`export const BUILD_SESSION_SECRET=${JSON.stringify(secret)}\n`,'utf8')
await writeFile('api/_lib/generated-session-secret.js',`export const BUILD_SESSION_SECRET=${JSON.stringify(secret)}\n`,'utf8')
console.log('Generated server-only session secret for this deployment.')

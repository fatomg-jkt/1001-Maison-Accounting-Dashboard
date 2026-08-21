declare const process: {
  env: Record<string, string | undefined>
}

declare const Buffer: {
  from: (value: any, encoding?: string) => any
}

declare module 'node:crypto' {
  const crypto: any
  export default crypto
}

declare module 'bcryptjs' {
  const bcrypt: any
  export default bcrypt
}

declare module '@vercel/blob' {
  export const list: any
  export const get: any
  export const put: any
  export const del: any
}

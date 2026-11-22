import { AuthError } from '@netlify/identity'

export function authStatus(error) {
  return error instanceof AuthError ? error.status ?? error.cause?.status : undefined
}

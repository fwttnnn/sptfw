/**
 * NOT MY CODE
 * reference: https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
 */

import crypto from "crypto"

export const generateAuthorizeURL = async (clientId: string, redirectURI: string, scopes: string[], challenge: string): Promise<string> => {
  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("response_type", "code")
  params.append("redirect_uri", redirectURI)
  params.append("scope", scopes.join(" "))
  params.append("code_challenge_method", "S256")
  params.append("code_challenge", challenge)

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

export const generateCodeVerifier = (length: number): string => {
  let text = ""
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export const getToken = async (clientId: string, code: string, verifier: string, redirectURI: string): Promise<any> => {
  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("redirect_uri", redirectURI)
  params.append("code_verifier", verifier)

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  })

  const json = await result.json()
  return json
}

export default {
  generateAuthorizeURL,
  generateCodeChallenge,
  generateCodeVerifier,
  getToken,
}

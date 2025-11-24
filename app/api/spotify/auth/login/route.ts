import { NextRequest, NextResponse } from "next/server"
import pkce from "@/lib/spotify/pkce"

export const GET = async (request: NextRequest) => {
  const scopes = ["playlist-read-private",
                  "playlist-read-collaborative",
                  "user-top-read",
                  // "user-read-recently-played",
                  "user-library-read"]

  const verifier = pkce.generateCodeVerifier(128)
  const challenge = await pkce.generateCodeChallenge(verifier)

  const spotifyAuthorizeURL = await pkce.generateAuthorizeURL(process.env.SPTFW_API_CID!,
                                              `${process.env.SPTFW_HOST_URI!}/api/spotify/auth/callback`,
                                              scopes,
                                              challenge)

  const response = NextResponse.redirect(spotifyAuthorizeURL)
  response.cookies.set("sptfw--cookie:verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  })

  return response
}

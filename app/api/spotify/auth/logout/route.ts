import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  const response = NextResponse.json({})
  response.cookies.delete("sptfw--cookie:verifier")
  response.cookies.delete("sptfw--cookie:token/access")
  response.cookies.delete("sptfw--cookie:token/refresh")
  response.cookies.delete("sptfw--cookie:profile/id")
  response.cookies.delete("sptfw--cookie:profile/usn")
  response.cookies.delete("sptfw--cookie:profile/pict")
  return response
}

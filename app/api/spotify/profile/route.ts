import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  const token = request.cookies.get("sptfw--cookie:token/access")?.value
  if (!token) return NextResponse.json({})

  const id   = request.cookies.get("sptfw--cookie:profile/id")?.value
  const usn  = request.cookies.get("sptfw--cookie:profile/usn")?.value
  const pict = request.cookies.get("sptfw--cookie:profile/pict")?.value
  return NextResponse.json({ id, usn, pict })
}

/**
 * NOTE: please delete this, it can be exploited.
 */

import api from "@/lib/spotify/api"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  const token = request.cookies.get("sptfw--cookie:token/access")?.value
  if (!token) return NextResponse.json({})

  const top = await api.top(token, 0)
  return NextResponse.json(top)
}

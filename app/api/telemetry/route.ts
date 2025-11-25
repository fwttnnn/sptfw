import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export const POST = async (request: NextRequest) => {
  if (!supabase) {
    return NextResponse.json({ success: false })
  }

  const body = await request.json()
  const { type, uid, aid } = body

  switch (type) {
    case "hover__axis": {
      await supabase
        .from("hover__axis")
        .upsert({ uid }, { onConflict: "uid" })
      break
    }
    case "hover__album": {
      // await supabase
      //   .from("hover__album")
      //   .upsert({ uid, aid }, { onConflict: "uid, aid" })
      break
    }
    default:
      return NextResponse.json({ success: false })
  }

  return NextResponse.json({ success: true })
}

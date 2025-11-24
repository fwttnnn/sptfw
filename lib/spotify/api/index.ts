import refresh from "@/lib/spotify/api/token/refresh"
import profile from "@/lib/spotify/api/user/profile"
import top from "@/lib/spotify/api/user/top"

export default {
  token: {
    refresh,
  },
  user: {
    profile,
    top,
  },
}

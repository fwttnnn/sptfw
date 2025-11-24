export default async (refreshToken: string): Promise<{ [key: string]: any }> => {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.SPTFW_API_CID!,
    }),
  })

  const json = await result.json()
  return json
}

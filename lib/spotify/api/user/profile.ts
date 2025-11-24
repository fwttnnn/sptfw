export default async (token: string): Promise<{[key: string]: any}> => {
  const result = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  const json = await result.json()
  return json
}

export default async (token: string): Promise<{[key: string]: any}> => {
  const result = await fetch(`https://api.spotify.com/v1/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })

  /**
   * profile --text: Check settings on developer.spotify.com/dashboard, the user may not be registered.
   */

  // try {
  //   console.log("profile --text:", await result.text())
  // } catch(_) {}

  console.log("profile --result:", result)
  const json = await result.json()
  console.log("profile:", json)
  return json
}

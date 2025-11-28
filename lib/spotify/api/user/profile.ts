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

  const imageURL = json.images && json.images.length > 0
    ? json.images[0].url
    : "https://i.pinimg.com/736x/68/fd/b0/68fdb089f4f34de82fd6d18f00b95f1e.jpg"

  return {...json, images: [{ url: imageURL }]}
}

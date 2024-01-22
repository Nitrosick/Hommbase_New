export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  if (!token.match(/^.*_hmbs$/)) return null
  return token
}

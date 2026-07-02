// set
export const setAccessToken = (token: string) => {
    localStorage.setItem('access_token', token)
}

// get
export const getAccessToken = () => {
    return localStorage.getItem('access_token')
}

// remove
export const removeAccessToken = () => {
    localStorage.removeItem('access_token')
}
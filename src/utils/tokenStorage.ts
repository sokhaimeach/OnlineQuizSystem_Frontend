// set
export const setAccessToken = (token: string, key = 'access_token') => {
    localStorage.setItem(key, token)
}

// get
export const getAccessToken = (key = 'access_token') => {
    return localStorage.getItem(key)
}

// remove
export const removeAccessToken = (key = 'access_token') => {
    localStorage.removeItem(key)
}
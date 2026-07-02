import axios from 'axios'
import {getAccessToken, setAccessToken, removeAccessToken} from '@/utils/tokenStorage'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// create a custom axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

// add a request interceptor
api.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// add response interceptor
api.interceptors.response.use((response) => {
    return response.data
}, async (error) => {
    if (error.response) {
        const originalRequest = error.config
        const { status } = error.response
        const {errorCode} = error.response.data || null

        // check if access token expired
        if (
            status === 401 &&
            errorCode === 'TOKEN_EXPIRED' &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {
            originalRequest._retry = true
            // refresh new access token
            try {
                const res = await api.post("/auth/refresh")

                const newAccessToken = res.data.access_token
                setAccessToken(newAccessToken)
            } catch(refreshError) {
                removeAccessToken()
                window.location.href = '/login'
            }
        }
        if (status === 500) {
            console.error("Server error: ", "An error occurred on the server.")
        }
    }

    return Promise.reject(error)
})

export default api
import axios from 'axios'
import {getAccessToken, setAccessToken, removeAccessToken} from '@/utils/tokenStorage'
import { getAccessTokenFromAuthPayload } from '@/utils/authRole'

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
    } else {
        const attemptToken = getAccessToken('x_attempt_token')
        if (attemptToken) {
            config.headers["x-attempt-token"] = attemptToken
        }
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
        const {errorCode} = error.response.data || {}

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

                const newAccessToken = getAccessTokenFromAuthPayload(res)
                if (!newAccessToken) throw new Error("Refresh response did not include an access token")
                setAccessToken(newAccessToken)
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
                return api(originalRequest)
            } catch(refreshError) {
                removeAccessToken()
                localStorage.removeItem('user_role')
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

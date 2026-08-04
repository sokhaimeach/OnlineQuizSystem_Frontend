import axios, {
    AxiosError,
    type InternalAxiosRequestConfig
} from 'axios'

import {
    getAccessToken,
    setAccessToken,
    removeAccessToken
} from '@/utils/tokenStorage'

import {
    getAccessTokenFromAuthPayload,
    getRoleFromAuthPayload,
    getRoleFromToken,
    setStoredRole
} from '@/utils/authRole'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Separate instance without response interceptors
const refreshApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

let refreshPromise: Promise<string> | null = null

export async function refreshAccessToken(): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = refreshApi
            .post('/auth/refresh')
            .then((response) => {
                const newAccessToken = getAccessTokenFromAuthPayload(response.data)

                if (!newAccessToken) {
                    throw new Error(
                        'Refresh response did not include an access token'
                    )
                }

                setAccessToken(newAccessToken)
                setStoredRole(
                    getRoleFromAuthPayload(response.data) ??
                    getRoleFromToken(newAccessToken)
                )

                return newAccessToken
            })
            .finally(() => {
                refreshPromise = null
            })
    }

    return refreshPromise
}

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken()

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        } else {
            const attemptToken = getAccessToken('x_attempt_token')

            if (attemptToken) {
                config.headers['x-attempt-token'] = attemptToken
            }
        }

        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,

    async (error: AxiosError) => {
        const originalRequest = error.config as
            | RetryRequestConfig
            | undefined

        const status = error.response?.status

        const responseData = error.response?.data as
            | { errorCode?: string }
            | undefined

        const errorCode = responseData?.errorCode

        const isRefreshRequest =
            originalRequest?.url?.includes('/auth/refresh')

        if (
            status === 401 &&
            errorCode === 'TOKEN_EXPIRED' &&
            originalRequest &&
            !originalRequest._retry &&
            !isRefreshRequest
        ) {
            originalRequest._retry = true

            try {
                const newAccessToken = await refreshAccessToken()

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`

                return api(originalRequest)
            } catch (refreshError) {
                const refreshAxiosError = refreshError as AxiosError
                const refreshConfig = refreshAxiosError.config
                const requestUrl = refreshConfig
                    ? `${refreshConfig.baseURL ?? ''}${refreshConfig.url ?? ''}`
                    : undefined

                console.error('Authentication refresh failed:', {
                    status: refreshAxiosError.response?.status,
                    body: refreshAxiosError.response?.data,
                    requestUrl,
                })

                removeAccessToken()
                localStorage.removeItem('user_role')

                window.dispatchEvent(new Event('auth:session-expired'))

                return Promise.reject(refreshError)
            }
        }

        if (status === 500) {
            console.error(
                'Server error:',
                'An error occurred on the server.'
            )
        }

        return Promise.reject(error)
    }
)

export default api

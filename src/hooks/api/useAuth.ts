import { changePassword, login, logout, registerAsTeacher } from "@/services/auth.service"
import { removeAccessToken, setAccessToken } from "@/utils/tokenStorage"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            const accessToken = data.access_token
            setAccessToken(accessToken)
            window.location.href = '/teacher/dashboard'
        },
        onError: (error: any) => {
            console.error('Login failed:', error)
        }
    })
}

export const useRegisterAsTeacher = () => {

    return useMutation({
        mutationFn: registerAsTeacher,
        onSuccess: (data) => {
            const accessToken = data.access_token
            setAccessToken(accessToken)
            window.location.href = '/teacher/dashboard'
        },
        onError: (error: any) => {
            console.error('Registration failed:', error)
        }
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            removeAccessToken()
            window.location.href = '/login'
        },
    })
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
    })
}

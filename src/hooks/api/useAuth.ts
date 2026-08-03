import { changePassword, login, logout, registerAsStudent, registerAsTeacher, verifyTwoFactorLogin } from "@/services/auth.service"
import { removeAccessToken, setAccessToken } from "@/utils/tokenStorage"
import { getAccessTokenFromAuthPayload, getRoleFromAuthPayload, getRoleFromToken, requiresTwoFactor, setStoredRole } from "@/utils/authRole"
import { useMutation } from "@tanstack/react-query"

export const useLogin = (redirectTo?: string) => {

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // 2FA enabled: caller shows the verification step, do not log in yet
            if (requiresTwoFactor(data)) return
            const accessToken = getAccessTokenFromAuthPayload(data)
            if (!accessToken) throw new Error("Login response did not include an access token")
            setAccessToken(accessToken)
            const role = setStoredRole(getRoleFromAuthPayload(data) ?? getRoleFromToken(accessToken))
            window.location.href = role === 'STUDENT'
                ? redirectTo || '/student/dashboard'
                : '/teacher/dashboard'
        },
        onError: (error: any) => {
            console.error('Login failed:', error)
        }
    })
}

export const useVerify2FALogin = (redirectTo?: string) => {
    return useMutation({
        mutationFn: verifyTwoFactorLogin,
        onSuccess: (data) => {
            const accessToken = getAccessTokenFromAuthPayload(data)
            if (!accessToken) throw new Error("Login response did not include an access token")
            setAccessToken(accessToken)
            const role = setStoredRole(getRoleFromAuthPayload(data) ?? getRoleFromToken(accessToken))
            window.location.href = role === 'STUDENT'
                ? redirectTo || '/student/dashboard'
                : '/teacher/dashboard'
        },
        onError: (error: any) => {
            console.error('2FA verification failed:', error)
        }
    })
}

export const useRegisterAsTeacher = () => {

    return useMutation({
        mutationFn: registerAsTeacher,
        onSuccess: (data) => {
            const accessToken = getAccessTokenFromAuthPayload(data)
            if (!accessToken) throw new Error("Registration response did not include an access token")
            setAccessToken(accessToken)
            setStoredRole(getRoleFromAuthPayload(data) ?? getRoleFromToken(accessToken) ?? 'TEACHER')
            window.location.href = '/teacher/dashboard'
        },
        onError: (error: any) => {
            console.error('Registration failed:', error)
        }
    })
}

export const useRegisterAsStudent = () => {
    return useMutation({
        mutationFn: registerAsStudent,
        onSuccess: data => {
            const accessToken = getAccessTokenFromAuthPayload(data)
            if (!accessToken) throw new Error("Registration response did not include an access token")
            setAccessToken(accessToken)
            setStoredRole(getRoleFromAuthPayload(data) ?? getRoleFromToken(accessToken) ?? 'STUDENT')
        },
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            removeAccessToken()
            localStorage.removeItem('user_role')
            window.location.href = '/login'
        },
    })
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
    })
}

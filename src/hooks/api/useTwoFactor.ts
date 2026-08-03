import { useMutation } from "@tanstack/react-query"
import {
    disableTwoFactor,
    enableTwoFactor,
    setupTwoFactor,
} from "@/services/twoFactor.service"

export const useTwoFactorSetup = () => {
    return useMutation({
        mutationFn: setupTwoFactor,
    })
}

export const useTwoFactorEnable = () => {
    return useMutation({
        mutationFn: enableTwoFactor,
    })
}

export const useTwoFactorDisable = () => {
    return useMutation({
        mutationFn: disableTwoFactor,
    })
}

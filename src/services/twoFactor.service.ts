import api from "@/lib/axios"
import type {
    TwoFactorDisablePayload,
    TwoFactorSetupResult,
} from "@/models/auth.interface"

export interface TwoFactorActionBody {
    success: boolean
    message: string
    data: {
        success: boolean
    }
}

export const setupTwoFactor = async () => {
    return api.post<{ data: TwoFactorSetupResult }>(
        "/account/2fa/setup",
    ) as unknown as Promise<{ success: boolean; message: string; data: TwoFactorSetupResult }>
}

export const enableTwoFactor = async (code: string) => {
    return api.post("/account/2fa/enable", { code }) as unknown as Promise<TwoFactorActionBody>
}

export const disableTwoFactor = async (payload: TwoFactorDisablePayload) => {
    return api.post("/account/2fa/disable", payload) as unknown as Promise<TwoFactorActionBody>
}

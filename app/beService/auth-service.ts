import { baseApi } from '../store/api/baseApi'
import { User } from '../store/slices/authSlice'

interface SendOtpRequest {
    phone: string
}

interface VerifyOtpRequest {
    phone: string
    otp: string
}

interface SendOtpResponse {
    success: boolean
}

interface VerifyOtpResponse {
    success: boolean
    user: User
    token: string
}

interface ErrorResponse {
    error: string
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
            query: (body) => ({
                url: '/auth/send-otp',
                method: 'POST',
                body,
            }),
        }),

        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (body) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
    }),
})

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useLogoutMutation,
} = authApi

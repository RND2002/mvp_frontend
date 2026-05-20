import { baseApi } from '../store/api/baseApi'
import { User } from '../store/slices/authSlice'

interface SendOtpRequest {
    phone?: string
    email?: string
}

interface VerifyOtpRequest {
    phone?: string
    email?: string
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

interface EmailPasswordRequest {
    email: string
    password: string
    role?: string
}

interface AuthResponse {
    success: boolean
    user: User
    token: string
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        loginWithEmail: builder.mutation<AuthResponse, EmailPasswordRequest>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),

        signupWithEmail: builder.mutation<AuthResponse, EmailPasswordRequest>({
            query: (body) => ({
                url: '/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),

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
    useLoginWithEmailMutation,
    useSignupWithEmailMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useLogoutMutation,
} = authApi

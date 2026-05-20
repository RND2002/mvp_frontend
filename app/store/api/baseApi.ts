import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { logout, setToken } from '../slices/authSlice'

const rawBaseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const requestUrl = typeof args === 'string' ? args : args.url
        const isRefreshRequest = requestUrl.includes('/auth/refresh-token')

        if (!isRefreshRequest) {
            const refreshResult = await rawBaseQuery(
                { url: '/auth/refresh-token', method: 'POST' },
                api,
                extraOptions
            )

            if (refreshResult.data && typeof refreshResult.data === 'object' && 'token' in refreshResult.data) {
                api.dispatch(setToken(String(refreshResult.data.token)))
                result = await rawBaseQuery(args, api, extraOptions)
                return result
            }
        }

        api.dispatch(logout())

        if (typeof window !== 'undefined') {
            window.location.href = '/'
        }
    }
    return result
}

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Booking', 'Product', 'Cart', 'Order', 'Location'],
    endpoints: () => ({}),
})

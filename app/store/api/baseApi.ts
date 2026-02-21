import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { logout } from '../slices/authSlice'

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
        // Clear auth state
        api.dispatch(logout())

        // Redirect to home page (which triggers login logic or modal)
        if (typeof window !== 'undefined') {
            window.location.href = '/'
        }
    }
    return result
}

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Booking', 'Product', 'Cart', 'Order'],
    endpoints: () => ({}),
})

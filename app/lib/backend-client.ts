import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    [key: string]: any;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod;
    body?: any;
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
}

/**
 * Robust backend API client for server-side usage in Next.js routes.
 */
export async function backendFetch<T = any>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<ApiResponse<T>> {
    const { method = 'GET', body, headers = {}, ...rest } = options;

    const cookieStore = await cookies();
    const token = cookieStore.get('sb_access_token')?.value;

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
        const response = await fetch(url, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
            ...rest,
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            return {
                success: false,
                error: result.message || result.error || `Error ${response.status}: ${response.statusText}`,
                status: response.status,
            };
        }

        // Standardize response format
        return {
            success: true,
            ...result,
        };
    } catch (error: any) {
        console.error(`Backend Fetch Error [${method} ${endpoint}]:`, error);
        return {
            success: false,
            error: error.message || 'Internal connection error',
        };
    }
}

export const backend = {
    get: <T = any>(url: string, opts?: RequestOptions) => backendFetch<T>(url, { ...opts, method: 'GET' }),
    post: <T = any>(url: string, body?: any, opts?: RequestOptions) => backendFetch<T>(url, { ...opts, method: 'POST', body }),
    patch: <T = any>(url: string, body?: any, opts?: RequestOptions) => backendFetch<T>(url, { ...opts, method: 'PATCH', body }),
    put: <T = any>(url: string, body?: any, opts?: RequestOptions) => backendFetch<T>(url, { ...opts, method: 'PUT', body }),
    delete: <T = any>(url: string, opts?: RequestOptions) => backendFetch<T>(url, { ...opts, method: 'DELETE' }),
};

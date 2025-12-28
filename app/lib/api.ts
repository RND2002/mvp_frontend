/**
 * Universal API Request Handler
 * Supports GET + POST/PUT/PATCH/DELETE with JSON parsing, errors, and safe defaults
 */
export async function apiRequest<TResponse = any, TPayload = any>(
    endpoint: string,
    options: {
        method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        payload?: TPayload;
        headers?: Record<string, string>;
    } = {}
) {
    const { method = "GET", payload, headers = {} } = options;

    const fetchOptions: RequestInit = {
        method,
        headers: {
            ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
            ...headers,
        },
        ...(method !== "GET" && payload ? { body: JSON.stringify(payload) } : {}),
    };

    try {
        const res = await fetch(endpoint, fetchOptions);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return { success: false, error: data?.message || "Request failed" };
        }

        return { success: true, data: data.data as TResponse };
    } catch (err: any) {
        console.error("API Error:", err);
        return { success: false, error: err.message || "Unknown error occurred" };
    }
}

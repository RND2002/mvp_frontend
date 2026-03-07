"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/app/store/slices/authSlice'
import { Loader } from "@/components/ui/loader"
import { useSyncUserMutation } from '@/app/beService/user-service'

export default function AuthCallbackPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<string>('Verifying your login...')
    const [showManualRedirect, setShowManualRedirect] = useState(false)
    // const [syncUser] = useSyncUserMutation()

    useEffect(() => {
        // Fallback timer
        const timer = setTimeout(() => {
            setShowManualRedirect(true)
            setStatus('Taking longer than expected...')
        }, 3000)

        const handleAuth = async (accessToken: string) => {
            try {
                // 1. Sync session with server for middleware cookie
                const sessionRes = await fetch("/api/auth/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ access_token: accessToken }),
                });

                if (!sessionRes.ok) throw new Error("Failed to set session cookie");

                // 2. Fetch user details from our backend
                const userRes = await fetch("/api/users/me");
                const userData = await userRes.json();

                if (!userData.success || !userData.user) {
                    throw new Error("Failed to fetch user details from backend");
                }

                const user = {
                    id: userData.user.id,
                    email: userData.user.email,
                    phone: userData.user.phone,
                }

                // 3. Update Redux store
                dispatch(setCredentials({
                    user,
                    token: accessToken
                }))

                // 4. Call centralised user upsert API 
                // await syncUser({
                //     id: userData.user.id,
                //     email: userData.user.email,
                //     phone: userData.user.phone
                // }).unwrap()

                setStatus('Login successful! Redirecting...')
                window.location.href = '/dashboard'
            } catch (err: any) {
                console.error("Auth callback error:", err);
                setError(err.message || "Authentication failed during sync");
            }
        }

        // 1. Check for basic error params in hash or query
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const searchParams = new URLSearchParams(window.location.search)

        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description')
        const errorType = hashParams.get('error') || searchParams.get('error')

        if (errorType || errorDescription) {
            setError(errorDescription || errorType || 'Authentication failed')
            clearTimeout(timer)
            return
        }

        // 2. Extract tokens from hash
        const accessToken = hashParams.get('access_token')

        if (accessToken) {
            handleAuth(accessToken)
        } else {
            // If no token, maybe it's a slow redirect or an invalid hit
            console.log("No token found in hash yet...");
        }

        return () => clearTimeout(timer)
    }, [dispatch, router])

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4 text-center p-4">
                    <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-red-500">Login Failed</h3>
                    <p className="text-gray-400 max-w-[300px]">{error.replace(/\+/g, ' ')}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <div className="flex flex-col items-center gap-4">
                <Loader size="lg" text="Authenticating..." />
                <p className="text-gray-400">{status}</p>

                {showManualRedirect && (
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-md transition-colors font-medium text-white animate-in fade-in slide-in-from-bottom-2"
                    >
                        Go to Dashboard
                    </button>
                )}
            </div>
        </div>
    )
}

"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/app/store/slices/authSlice'
import supabase from '@/app/api/supabaseClient'
import { Loader2 } from 'lucide-react'

import { useSyncUserMutation } from '@/app/beService/user-service'

export default function AuthCallbackPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<string>('Verifying your login...')
    const [showManualRedirect, setShowManualRedirect] = useState(false)
    const [syncUser] = useSyncUserMutation()

    useEffect(() => {
        // Fallback timer
        const timer = setTimeout(() => {
            setShowManualRedirect(true)
            setStatus('Taking longer than expected...')
        }, 3000)

        const handleSession = async (session: any) => {
            if (session) {
                const user = {
                    id: session.user.id,
                    email: session.user.email,
                    phone: session.user.phone,
                }

                dispatch(setCredentials({
                    user,
                    token: session.access_token
                }))

                // Sync session with server for middleware cookie
                try {
                    await fetch("/api/auth/session", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ access_token: session.access_token }),
                    });

                    // Call centralised user upsert API 
                    await syncUser({
                        id: session.user.id,
                        email: session.user.email,
                        phone: session.user.phone
                    }).unwrap()

                } catch (err) {
                    console.error("Failed to sync session or save user", err);
                }

                setStatus('Login successful! Redirecting...')
                window.location.href = '/dashboard'
            }
        }

        // 1. Check for basic error params
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const errorDescription = hashParams.get('error_description')
        const error = hashParams.get('error')

        if (error || errorDescription) {
            setError(errorDescription || error || 'Authentication failed')
            clearTimeout(timer)
            return
        }

        // 2. Try getting session normally
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                await handleSession(session)
            } else {
                // 3. Fallback: Manually check for tokens in hash if getSession failed
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')

                if (accessToken && refreshToken) {
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })
                    if (data.session) {
                        await handleSession(data.session)
                    } else if (error) {
                        setError(error.message)
                    }
                }
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await handleSession(session)
            } else if (event === 'SIGNED_OUT') {
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                if (hashParams.get('error')) {
                    setError(hashParams.get('error_description') || 'Authentication failed')
                }
            }
        })

        return () => {
            subscription.unsubscribe()
            clearTimeout(timer)
        }
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
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
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

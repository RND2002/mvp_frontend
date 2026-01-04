"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@/app/store/slices/authSlice'
import supabase from '@/app/api/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Check for error in hash immediately
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const errorDescription = hashParams.get('error_description')
        const error = hashParams.get('error')

        if (error || errorDescription) {
            setError(errorDescription || error || 'Authentication failed')
            return
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                const user = {
                    id: session.user.id,
                    email: session.user.email,
                    phone: session.user.phone,
                }

                dispatch(setCredentials({
                    user,
                    token: session.access_token
                }))

                router.push('/dashboard')
            } else if (event === 'SIGNED_OUT') {
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                if (hashParams.get('error')) {
                    setError(hashParams.get('error_description') || 'Authentication failed')
                }
            }
        })

        return () => {
            subscription.unsubscribe()
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
                <p className="text-gray-400">Verifying your login...</p>
            </div>
        </div>
    )
}

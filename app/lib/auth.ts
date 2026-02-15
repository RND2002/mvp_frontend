import { cookies } from 'next/headers';
import { backend } from './backend-client';

// Helper to get authenticated user from Backend API
export async function getAuthenticatedUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('sb_access_token')?.value;

    if (!token) {
        return { user: null, error: 'Unauthorized' };
    }

    // Verify session by calling backend /users/me
    const res = await backend.get('/users/me');

    if (!res.success || !res.user) {
        return { user: null, error: res.error || 'Invalid session' };
    }

    return {
        user: res.user,
        error: null
    };
}

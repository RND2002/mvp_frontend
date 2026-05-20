
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    phone?: string;
    email?: string;
    role?: string;
    // Add other user properties as needed
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoginModalOpen: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoginModalOpen: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User | null; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isLoginModalOpen = action.payload;
        },
    },
});

export const { setCredentials, logout, setToken, setLoginModalOpen } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoginModalOpen = (state: { auth: AuthState }) => state.auth.isLoginModalOpen;

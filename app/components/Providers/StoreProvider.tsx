"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/app/store/store";
import { setCredentials } from "@/app/store/slices/authSlice";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;

        const loadMe = async () => {
            const res = await fetch('/api/auth/me', { credentials: 'include' });
            if (!res.ok) return false;

            const data = await res.json();
            if (data.authenticated && isMounted) {
                dispatch(setCredentials({
                    user: data.user,
                    token: "cookie"
                }));
                return true;
            }

            return false;
        };

        const checkAuth = async () => {
            try {
                const authenticated = await loadMe();
                if (authenticated) return;

                const refreshRes = await fetch('/api/auth/refresh-token', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (refreshRes.ok) {
                    const refreshed = await loadMe();
                    if (refreshed) return;
                }

                if (isMounted) {
                    if (window.location.pathname !== '/') {
                        window.location.href = '/';
                    }
                }
            } catch (error) {
                console.error("Auth check failed", error);
            }
        };
        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    return <>{children}</>;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <AuthInitializer>
                {children}
            </AuthInitializer>
        </Provider>
    );
};

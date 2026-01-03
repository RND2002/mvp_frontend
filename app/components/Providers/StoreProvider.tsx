"use client";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/app/store/store";
import { setCredentials } from "@/app/store/slices/authSlice";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated) {
                        dispatch(setCredentials({
                            user: data.user,
                            token: "cookie" // Token is HttpOnly, effectively present
                        }));
                    }
                }
            } catch (error) {
                console.error("Auth check failed", error);
            }
        };
        checkAuth();
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

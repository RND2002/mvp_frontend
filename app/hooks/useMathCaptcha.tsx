"use client";

import { useState, useEffect, useCallback } from "react";

interface CaptchaResponse {
    token: string;
    question: string;
}

export function useMathCaptcha() {
    const [question, setQuestion] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadCaptcha = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/captcha");
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = (await res.json()) as CaptchaResponse;
            setQuestion(data.question ?? "");
            setToken(data.token ?? "");
            setAnswer("");
        } catch (err) {
            console.error("Failed to load captcha:", err);
            setQuestion("");
            setToken("");
            setError("Failed to load CAPTCHA");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCaptcha();
    }, [loadCaptcha]);

    return {
        question,
        token,
        answer,
        setAnswer,
        refresh: loadCaptcha,
        loading,
        error,
        isReady: !loading && !!question && !error,
    };
}

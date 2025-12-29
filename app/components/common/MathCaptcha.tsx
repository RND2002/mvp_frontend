"use client";

import React from "react";
import { useMathCaptcha } from "@/app/hooks/useMathCaptcha";
import clsx from "clsx";

interface MathCaptchaProps {
    captcha: ReturnType<typeof useMathCaptcha>;
    inputClassName?: string;
    showRefreshButton?: boolean;
}

const MathCaptcha: React.FC<MathCaptchaProps> = ({
    captcha,
    inputClassName = "min-w-[30px] max-w-[50px]",
    showRefreshButton = false,
}) => {
    const { loading, error, question, answer, setAnswer, refresh, isReady } =
        captcha;

    return (
        <div className="flex items-center gap-2">
            <p className="font-medium text-sm shrink-0">
                {loading && (
                    <span className="inline-flex items-center justify-center gap-2 text-paragraph text-xs w-10">
                        <span className="h-3 w-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></span>
                    </span>
                )}

                {!loading && error && (
                    <span className="text-xs text-primary">{error}</span>
                )}

                {!loading && !error && question && <span>{question} =</span>}
            </p>

            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={clsx(
                    "flex-1 border-b text-xs lg:text-sm 2xl:text-base",
                    "placeholder-[#B4B4B4] focus:border-black border-paragraph/50",
                    "focus:ring-0 focus:outline-none",
                    inputClassName
                )}
                disabled={!isReady}
                aria-disabled={!isReady}
                aria-label="Math captcha answer"
            />

            {showRefreshButton && (
                <button
                    type="button"
                    onClick={() => refresh()}
                    className={clsx(
                        "text-xs underline shrink-0",
                        !loading ? "text-blue-600" : "text-gray-400 cursor-not-allowed"
                    )}
                    disabled={loading}
                    aria-disabled={loading}
                >
                    Refresh
                </button>
            )}
        </div>
    );
};

export default MathCaptcha;

"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useCustomToast } from "@/components/ui/custom-toast";

function VerifyPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const toast = useCustomToast();

    const token = searchParams.get("token");
    console.log(token);
    const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid verification link.");
                toast.error("Invalid verification link.");
                setTimeout(() => {
                    router.push("/");
                }, 2000);
                return;
            }
            setStatus("verifying");
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL || ""}/api/waitlist/confirm`,
                    { token },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setStatus("success");
                const msg =
                    res.data.message ||
                    "Your email has been successfully verified! Thank you for joining the waitlist.";
                setMessage(msg);
                toast.success(msg);
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } catch (err: any) {
                console.log(err);
                let errorMsg = "An error occurred while verifying your email. Please try again later.";
                if (err?.response?.data?.message) {
                    errorMsg = err.response.data.message || "Verification failed. Please try again";
                }
                setStatus("error");
                setMessage(errorMsg);
                toast.error(errorMsg);
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            }
        };

        verifyEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#f9f9f9] bg-grid-pattern">
            <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <div className="max-w-md mx-auto text-center z-10 mt-12">
                    <div className="bg-white rounded-2xl shadow-xl px-8 py-10 md:py-12 md:px-12 border border-gray-100">
                        {status === "verifying" && (
                            <>
                                <div className="mb-6 flex justify-center">
                                    <div className="animate-spin w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full"></div>
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-gray-800">Verifying your email...</h2>
                                <p className="text-gray-500">Please wait while we confirm your email address.</p>
                            </>
                        )}
                        {status === "success" && (
                            <>
                                <div className="mb-6 flex justify-center">
                                    <span className="inline-block bg-green-100 text-green-600 rounded-full p-3 text-4xl shadow-lg">✓</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-green-600">Email Verified</h2>
                                <p className="text-gray-700">{message}</p>
                            </>
                        )}
                        {status === "error" && (
                            <>
                                <div className="mb-6 flex justify-center ">
                                    <span className="inline-block bg-red-100 text-red-500 rounded-full p-3 text-4xl shadow-lg">✗</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-red-500">Verification Failed</h2>
                                <p className="text-gray-700">{message}</p>
                            </>
                        )}
                    </div>
                </div>
                {/* Confetti Elements */}
                <div className="absolute top-1/3 left-1/5 w-3 h-3 bg-yellow-400 rounded-full animate-float-fast"></div>
                <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full animate-float-delayed"></div>
                <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-green-300 rounded-full animate-bounce-slow"></div>
                <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse-slow"></div>
            </main>
            <footer className="py-6 px-6 text-center text-sm text-gray-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <p>
                        © 2025 Memed <span className="inline-block animate-spin-slow">🔥</span>
                    </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="https://github.com/furkannabisumji/memed" target="_blank" className="hover:text-green-600 transition-colors">
                            GitHub
                        </a>
                        <a href="https://x.com/memeddotfun" target="_blank" className="hover:text-green-600 transition-colors">
                            X
                        </a>
                        <a href="https://t.me/memeddotfun" target="_blank" className="hover:text-green-600 transition-colors">
                            Telegram
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const VerifyPage = () => (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <VerifyPageContent />
    </Suspense>
);

export default VerifyPage;
"use client"

import InputBox from "@/components/InputBox";
import Link from "next/link";
import { signUp } from "@/auth/nextjs/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import logger from "@/util/logger";

export default function RegisterCard() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "BUYER"
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                setIsSubmitting(false);
                return;
            }

            const result = await signUp(formData);

            if (!result.success) {
                setError(result.error || "Registration failed");
                logger.warn("RegisterCard: Registration failed", { error: result.error });
            } else if (result.redirectPath) {
                router.push(result.redirectPath);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            logger.error("RegisterCard: Unexpected error during registration", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleChange = (e) => {
        try {
            const { name, value } = e.target;

            if (error) {
                setError("");
            }

            setFormData({
                ...formData,
                [name]: value
            });
        } catch (err) {
            logger.error("RegisterCard: Error in handleChange", err);
        }
    }

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 dark:bg-neutral-800 dark:text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
                Register
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-100 dark:border-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="py-2">
                    <InputBox
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="py-2">
                    <InputBox
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="py-2">
                    <InputBox
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                    <label htmlFor="buyer-radio" className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                        <input
                            type="radio"
                            id="buyer-radio"
                            name="role"
                            value="BUYER"
                            checked={formData.role === "BUYER"}
                            onChange={handleChange}
                            className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        />
                        <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Buyer</span>
                    </label>

                    <label htmlFor="business-radio"
                           className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                        <input
                            type="radio"
                            id="business-radio"
                            name="role"
                            value="BUSINESS"
                            checked={formData.role === "BUSINESS"}
                            onChange={handleChange}
                            className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        />
                        <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Business</span>
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-md mt-4 hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
                <Link className="text-blue-500" href="/login">
                    Already a member? Login here.
                </Link>
            </div>
        </div>
    )
}
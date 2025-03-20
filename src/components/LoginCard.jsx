"use client"

import { useState, useEffect } from "react";
import InputBox from "@/components/InputBox";
import Link from "next/link";
import { signIn } from "@/auth/nextjs/actions";
import logger from "@/util/logger";

export default function LoginCard() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        logger.log("LoginCard: Component initialized");
    }, []);

    const validateForm = () => {
        try {
            let validationErrors = null;

            if (!formData.email) {
                validationErrors = { message: "Email is required" };
                return { isValid: false, errors: validationErrors };
            }

            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                validationErrors = { message: "Email is invalid" };
                return { isValid: false, errors: validationErrors };
            }

            if (!formData.password) {
                validationErrors = { message: "Password is required" };
                return { isValid: false, errors: validationErrors };
            }

            return { isValid: true, errors: null };
        } catch (err) {
            logger.error("LoginCard: Error validating form", err);
            return { isValid: false, errors: { message: "Error validating form" } };
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsSubmitting(true);
            setError(null);

            const { isValid, errors } = validateForm();
            if (!isValid) {
                setError(errors);
                setIsSubmitting(false);
                return;
            }

            logger.log("LoginCard: Submitting login request", { email: formData.email });

            const signInError = await signIn(formData).catch(err => {
                logger.error("LoginCard: Sign in action threw an error", err);
                return "Authentication failed. Please try again.";
            });

            if (signInError) {
                logger.error("LoginCard: Sign in failed", { error: signInError });
                setError(typeof signInError === 'string' ? { message: signInError } : signInError);
            } else {
                logger.log("LoginCard: Sign in succeeded");
            }
        } catch (err) {
            logger.error("LoginCard: Unexpected error during sign in", err);
            setError({ message: err.message || "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        try {
            const { name, value } = e.target;
            logger.log(`LoginCard: Field "${name}" changed`);

            if (error) {
                setError(null);
            }

            setFormData({
                ...formData,
                [name]: value
            });
        } catch (err) {
            logger.error("LoginCard: Error in handleChange", err);
        }
    };

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 dark:bg-neutral-800 dark:text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
                Login
            </h2>
            {error && error.message && <div className="text-red-500 text-sm mb-4">{error.message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="py-2">
                    <InputBox
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="py-2">
                    <InputBox
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange} />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-md mt-4 hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
                <Link className="text-blue-500" href="/register">
                    Not a member? Register here
                </Link>
            </div>
        </div>
    )
}
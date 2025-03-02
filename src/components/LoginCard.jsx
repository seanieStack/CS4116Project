"use client"

import InputBox from "@/components/InputBox";
import Link from "next/link";
import {useState} from "react";
import {signIn} from "@/auth/nextjs/actions";

export default function LoginCard(){

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = await signIn(formData)
        if (error) {
            console.log(error)
            setError(error)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 dark:bg-neutral-800 dark:text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
                Login
            </h2>
            {error && <div className="text-red-500 text-sm">{error.message}</div>}
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
                <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md mt-4 hover:bg-blue-600">
                    Login
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
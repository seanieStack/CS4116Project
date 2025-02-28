"use client"

import InputBox from "@/components/InputBox";
import Link from "next/link";

export default function LoginCard(){

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 dark:bg-neutral-800 dark:text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
                Login
            </h2>
            <form>
                <div className="py-2">
                    <InputBox type="email" placeholder="Email"/>
                </div>

                <div className="py-2">
                    <InputBox type="password" placeholder={"Password"}/>
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
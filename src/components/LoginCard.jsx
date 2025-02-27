"use client"

import {useState} from "react";
import InputBox from "@/components/InputBox";
import {Switch} from "@headlessui/react";

export default function LoginCard(){
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 dark:bg-neutral-800 dark:text-white">
            <h2 className="text-2xl font-bold text-center mb-6">
                {isLogin ? 'Login' : 'Register'}
            </h2>
            <form>
                <div className="py-2">
                    <InputBox type="email" placeholder="Email"/>
                </div>

                <div className="py-2">
                    <InputBox type="password" placeholder={"Password"}/>
                </div>

                {!isLogin && (
                    <>
                        <div className="py-2">
                            <InputBox type="password" placeholder={"Confirm Password"}/>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                            <label htmlFor="hs-radio-in-form" className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                                <input type="radio" name="hs-radio-in-form"
                                       className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                       id="hs-radio-in-form" defaultChecked/>
                                <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Buyer</span>
                            </label>

                            <label htmlFor="hs-radio-checked-in-form"
                                   className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                                <input type="radio" name="hs-radio-in-form"
                                       className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                       id="hs-radio-checked-in-form"/>
                                <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Business</span>
                            </label>
                        </div>
                    </>
                    )
                }

                <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-md mt-4 hover:bg-blue-600">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
                <span className={`text-sm font-medium transition ${isLogin ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}>
                    Sign In
                </span>
                <Switch
                    checked={!isLogin}
                    onChange={() => setIsLogin(!isLogin)}
                    className="relative inline-flex h-6 w-12 items-center rounded-full transition focus:outline-none bg-blue-500">
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${!isLogin ? "translate-x-7" : "translate-x-1"}`}/>
                </Switch>
                <span className={`text-sm font-medium transition ${!isLogin ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}>
                    Sign Up
                </span>
            </div>
        </div>
    )
}
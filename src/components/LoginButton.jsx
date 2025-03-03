"use client"

import Link from "next/link";
import {usePathname} from "next/navigation";

export default function LoginButton({hidden = false}) {
    const pathName = usePathname();

    return (
        <Link href="/login"
              className={`${hidden ? "lg:hidden" : "hidden"} lg:inline-flex py-2 px-3 items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 ${pathName === "/login" || pathName === "/register" ? "bg-blue-500" : "bg-white dark:bg-neutral-800"} text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700`}>
            Sign In / Sign Up
        </Link>
    )
}
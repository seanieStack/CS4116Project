"use server";
import {signOut} from "@/auth/nextjs/actions";

export default async function LogoutButton({hidden = false}){
    return (
        <button onClick={signOut} className={`${hidden ? "lg:hidden" : "hidden"} lg:inline-flex py-2 px-3 items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-blue-500 text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700`}>
            Logout
        </button>
    )
}
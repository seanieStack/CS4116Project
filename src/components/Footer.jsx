"use client"

export default function Footer(){
    return (
        <footer className="flex flex-wrap md:justify-start md:flex-nowrap w-full h-16 bg-blue-400 text-sm py-3 dark:bg-blue-950">
            <div className="max-w-[100rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
                <p className="md:order-1 flex-none text-m font-semibold dark:text-white focus:outline-none focus:opacity-80"> &copy; 2025 Techs & The City, Inc. All rights reserved.</p>
            </div>
        </footer>
    )
}
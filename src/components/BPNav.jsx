"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function BPNav() {
    const pathname = usePathname();

    return (
        <nav className="w-full bg-gray-100 dark:bg-neutral-900 shadow-sm border-b border-gray-200 dark:border-neutral-700">
            <ul className="flex space-x-6 h-12 items-center px-4 sm:px-6 lg:px-8">

                <li>
                    <Link
                        href="/businesspanel"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/businesspanel"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Overview
                    </Link>
                </li>

                <li>
                    <Link
                        href="/businesspanel/services"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/businesspanel/services"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Services
                    </Link>
                </li>

                <li>
                    <Link
                        href="/businesspanel/messages"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/businesspanel/messages"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Messages
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="w-full bg-gray-100 dark:bg-neutral-900 shadow-sm border-b border-gray-200 dark:border-neutral-700 h-12">
            <ul className="flex space-x-6 h-12 items-center px-4 sm:px-6 lg:px-8">
                <li>
                    <Link
                        href="/admin"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/admin"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Overview
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/messages"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/admin/messages"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Messages
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/reviews"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/admin/reviews"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Reviews
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/services"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/admin/services"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Services
                    </Link>
                </li>
                <li>
                    <Link
                        href="/admin/users"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/admin/users"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Users
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
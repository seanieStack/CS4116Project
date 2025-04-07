"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="w-full bg-gray-100 dark:bg-neutral-900 shadow-sm border-b border-gray-200 dark:border-neutral-700">
            <ul className="flex space-x-6 h-12 items-center px-4 sm:px-6 lg:px-8">

                <li>
                    <Link
                        href="/adminpanel/messages"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/adminpanel/messages"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Messages
                    </Link>
                </li>

                <li>
                    <Link
                        href="/adminpanel/reviews"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/adminpanel/reviews"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Reviews
                    </Link>
                </li>

                <li>
                    <Link
                        href="/adminpanel/services"
                        className={clsx(
                            "text-sm font-medium transition-colors px-2 py-1 rounded",
                            pathname === "/adminpanel/services"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        )}
                    >
                        Services
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
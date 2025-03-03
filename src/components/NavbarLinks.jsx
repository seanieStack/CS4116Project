"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
    { name: "Landing", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Business Panel", href: "/business-panel" },
    { name: "Admin Panel", href: "/admin-panel" },
    { name: "Contact", href: "/contact" }
];

export default function NavbarLinks({ user, children }) {
    const pathName = usePathname();

    console.log(user);

    return (
        <div className="flex flex-col gap-5 mt-5 lg:flex-row lg:items-center lg:mt-0 lg:ps-5 px-4 max-lg:pb-4">
            {
                navLinks.map((link, index) => (
                    <div key={index}>
                        <Link href={link.href} className={`font-medium focus:outline-none ${pathName === link.href ? "text-blue-500" : "text-gray-600 hover:text-gray-400 focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"}`}>
                            {link.name}
                        </Link>
                        <hr className="lg:hidden my-2 p-0"/>
                    </div>
                ))
            }
            <div className="lg:hidden">
                {children}
            </div>
        </div>
    );
}
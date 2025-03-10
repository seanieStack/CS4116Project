"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "@/auth/nextjs/actions";

import Link from "next/link";

export default function Avatar({session, user}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    let url;

    if (session.role === "BUSINESS") {
        url = user?.logo || "";
    }
    else if (session.role === "USER") {
        url = user?.profile_img || "";
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAvatarClick = () => {
        setIsOpen(!isOpen);
    };

    const AvatarImage = () => {
        if (url === "") {
            return (
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-medium text-sm cursor-pointer"
                    style={{ maxWidth: '32px', maxHeight: '32px' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
            );
        } else {
            return (
                <img
                    src={url}
                    alt="avatar"
                    className="inline-block w-8 h-8 rounded-full object-cover cursor-pointer"
                    style={{ maxWidth: '32px', maxHeight: '32px' }}
                />
            );
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={handleAvatarClick}>
                <AvatarImage />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                        href="/profile" className="block w-full px-4 py-2 text-sm  text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md text-left">
                        Profile
                    </Link>
                    <button onClick={signOut} className="block w-full px-4 py-2 text-sm text-red-600  hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md text-left">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
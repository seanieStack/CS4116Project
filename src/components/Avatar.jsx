"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "@/auth/nextjs/actions";

import Link from "next/link";
import logger from "@/util/logger";

export default function Avatar({session, user}) {
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    let url;

    if (!session) {
        logger.error("Avatar component: session prop is missing");
        setError("Session information unavailable");
    }

    if (!user) {
        logger.error("Avatar component: user prop is missing");
        setError("User information unavailable");
    }

    try {
        if (session?.role === "BUSINESS") {
            url = user?.logo || "";
            logger.log("Avatar component: Loaded business profile", { hasLogo: !!user?.logo });
        }
        else if (session?.role === "BUYER") {
            url = user?.profile_img || "";
            logger.log("Avatar component: Loaded buyer profile", { hasProfileImg: !!user?.profile_img });
        } else {
            logger.warn(`Avatar component: Unknown role type: ${session?.role}`);
            url = "";
        }
    } catch (err) {
        logger.error("Avatar component: Error determining avatar URL", err);
        url = "";
        setError("Error loading profile image");
    }

    useEffect(() => {
        try {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        } catch (err) {
            logger.error("Avatar component: Error in click outside handler", err);
        }
    }, []);

    const handleAvatarClick = () => {
        try {
            setIsOpen(!isOpen);
            logger.log("Avatar component: Dropdown toggled", { isNowOpen: !isOpen });
        } catch (err) {
            logger.error("Avatar component: Error toggling dropdown", err);
            setError("Error opening menu");
        }
    };

    const handleSignOut = async () => {
        try {
            logger.log("Avatar component: Initiating sign out");
            await signOut();
        } catch (err) {
            logger.error("Avatar component: Error during sign out", err);
            setError("Sign out failed. Please try again.");
        }
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
                    onError={(_) => {
                        logger.error("Avatar component: Failed to load image", { url });
                        setError("Failed to load profile image");
                    }}
                />
            );
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>

            {error && (
                <div className="absolute -top-10 right-0 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs">
                    {error}
                </div>
            )}

            <div onClick={handleAvatarClick}>
                <AvatarImage />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                        href="/profile" className="block w-full px-4 py-2 text-sm  text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md text-left">
                        Profile
                    </Link>
                    <button onClick={handleSignOut} className="block w-full px-4 py-2 text-sm text-red-600  hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md text-left">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
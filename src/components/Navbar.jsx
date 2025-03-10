"use server"
import ColorModeToggle from "@/components/ColorModeToggle";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import NavbarLinks from "@/components/NavbarLinks";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Avatar from "@/components/Avatar";

export default async function Navbar() {

    const sessionInfo = await getCurrentSessionInfo();
    const user = sessionInfo ? await getCurrentUser() : null;

    return (
        <header
            className="flex flex-wrap lg:justify-start lg:flex-nowrap w-full h-16 bg-white text-sm py-3 dark:bg-neutral-800">
            <nav className="max-w-[100rem] mx-auto px-0 lg:px-4 flex flex-wrap basis-full items-center justify-between">
                <Link
                    className="lg:order-1 flex-none text-xl font-semibold text-black dark:text-white focus:outline-none focus:opacity-80 px-4"
                    href="#">Techs & The City</Link>
                <div className="lg:order-3 flex items-center gap-x-2">
                    <button type="button"
                            className="lg:hidden hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                            id="hs-navbar-alignment-collapse" aria-expanded="false" aria-controls="hs-navbar-alignment"
                            aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-alignment">
                        <Bars3Icon className="hs-collapse-open:hidden shrink-0 "/>
                        <XMarkIcon className="hs-collapse-open:block hidden shrink-0 "/>
                        <span className="sr-only">Toggle</span>
                    </button>
                    {!sessionInfo ?  (<LoginButton />) : (<Avatar user={user} session={sessionInfo} />)}

                    <ColorModeToggle/>
                </div>
                <div id="hs-navbar-alignment"
                     className="hs-collapse hidden overflow-hidden transition-[height,opacity] duration-300 basis-full bg-white dark:bg-neutral-800 grow-1 lg:grow-0 lg:basis-auto lg:block lg:order-2 z-50 w-max"
                     aria-labelledby="hs-navbar-alignment-collapse">
                    <NavbarLinks user={sessionInfo}>{!sessionInfo ?  (<LoginButton hidden={true}/>) : null}</NavbarLinks>
                </div>
            </nav>
        </header>
    );
}

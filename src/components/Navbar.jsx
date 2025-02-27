import ColorModeToggle from "@/components/ColorModeToggle";

export default function Navbar() {
    return (
        <header className="flex flex-wrap lg:justify-start lg:flex-nowrap w-full h-16 bg-white text-sm py-3 dark:bg-neutral-800">
            <nav className="max-w-[100rem] mx-auto px-0 lg:px-4 flex flex-wrap basis-full items-center justify-between">
                <a className="lg:order-1 flex-none text-xl font-semibold text-black dark:text-white focus:outline-none focus:opacity-80 px-4" href="#">Techs & The City</a>
                <div className="lg:order-3 flex items-center gap-x-2">
                    <button type="button" className="lg:hidden hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10" id="hs-navbar-alignment-collapse" aria-expanded="false" aria-controls="hs-navbar-alignment" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-alignment">
                        <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                        <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        <span className="sr-only">Toggle</span>
                    </button>
                    <a href="/login" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
                        Sign In / Sign Up
                    </a>
                    <ColorModeToggle />
                </div>
                <div id="hs-navbar-alignment" className="hs-collapse hidden overflow-hidden transition-[height,opacity] duration-300 basis-full bg-white dark:bg-neutral-800 grow-1 lg:grow-0 lg:basis-auto lg:block lg:order-2 z-50 w-max" aria-labelledby="hs-navbar-alignment-collapse">
                    <div className="flex flex-col gap-5 mt-5 lg:flex-row lg:items-center lg:mt-0 lg:ps-5 px-4 max-lg:pb-4">
                        <a className="font-medium text-blue-500 focus:outline-none" href="#" aria-current="page">Landing</a>
                        <hr className="lg:hidden m-0 p-0"/>
                        <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Services</a>
                        <hr className="lg:hidden m-0 p-0"/>
                        <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Business Panel</a>
                        <hr className="lg:hidden m-0 p-0"/>
                        <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Admin Panel</a>
                        <hr className="lg:hidden m-0 p-0"/>
                        <a className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500" href="#">Contact</a>
                    </div>
                </div>
            </nav>
        </header>
    );
}

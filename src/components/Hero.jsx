import {ArrowRightIcon} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Hero(){
    return (
        <section
            className="relative overflow-hidden bg-gradient-to-b from-blue-200 dark:from-blue-950 via-transparent to-transparent pb-12 pt-20 sm:pb-16 sm:pt-32 lg:pb-24 xl:pb-32 xl:pt-40 h-min">
            <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                        Innovate Faster:
                        <span className="text-blue-600 dark:text-blue-500">The Digital Marketplace for You.</span>
                    </h1>
                    <h2 className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
                        Discover smarter software solutions for your business—all in one place.
                    </h2>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link className="isomorphic-link isomorphic-link--internal inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" href="/services">
                            Shop Now
                            <ArrowRightIcon className="h-6 w-6 text-white" />
                        </Link>
                    </div>
                </div>
                <div className="relative mx-auto mt-10 max-w-lg">
                    <img className="invert contrast-150 dark:contrast-100 dark:invert-0 w-full rounded-2xl border border-gray-100 shadow"
                         src="homescreenimage.png" alt=""/>
                </div>
            </div>
        </section>
    )
}
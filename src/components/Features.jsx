import {CheckIcon,
    DocumentIcon,
    LockClosedIcon,
    ShoppingCartIcon
} from "@heroicons/react/24/outline";

export default function Features(){
    return (
        <div className="bg-white dark:bg-[#0a0a0a] py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base/7 font-semibold text-indigo-600">Build faster</h2>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 dark:text-white sm:text-5xl lg:text-balance">The Ultimate Marketplace for Software Services</p>
                    <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-200">Discover, buy, and sell premium software services in one place. From development to design, we've got everything covered.</p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        <div className="relative pl-16">
                            <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                                <div
                                    className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <ShoppingCartIcon className="text-white size-8"/>
                                </div>
                                Instant Purchases
                            </dt>
                            <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-200">Instantly purchase and access top software services from verified providers. No delays, no hassle—just seamless transactions.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                                <div
                                    className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <CheckIcon className="text-white size-8"/>
                                </div>
                                Verified Sellers
                            </dt>
                            <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-200">Every seller is verified for quality and reliability, ensuring you get the best software services without risks.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                                <div
                                    className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <DocumentIcon className="text-white size-8"/>
                                </div>
                                Custom Orders
                            </dt>
                            <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-200">Need a custom software solution? Post a request and get offers from top-rated service providers.
                            </dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base/7 font-semibold text-gray-900 dark:text-white">
                                <div
                                    className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                                    <LockClosedIcon className="text-white size-8"/>
                                </div>
                                Secure Transactions
                            </dt>
                            <dd className="mt-2 text-base/7 text-gray-600 dark:text-gray-200">Our marketplace ensures secure payments and data protection for all buyers and sellers.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

    )
}
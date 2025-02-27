export default function Stats(){
    return (
        <div className="bg-gradient-to-b from-white dark:from-[#0a0a0a] to-blue-400 dark:to-blue-950 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                    <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                        <dt className="text-base/7 text-gray-600 dark:text-gray-200">Transactions every 24 hours</dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">44
                            million
                        </dd>
                    </div>
                    <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                        <dt className="text-base/7 text-gray-600 dark:text-gray-200">Assets under holding</dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">$119
                            trillion
                        </dd>
                    </div>
                    <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                        <dt className="text-base/7 text-gray-600 dark:text-gray-200">New users annually</dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">46,000</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
};
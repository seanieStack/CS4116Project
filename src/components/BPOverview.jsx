export default function BPOverview() {
    return (
        <div className="flex w-full h-[calc(100vh-4em)] bg-gradient-to-b bg-blue-200 from-white dark:from-blue-950 dark:bg-background">
            <div className="py-16 px-36 md:py-8 md:px-18 w-full">
                <div className="space-y-8 text-gray-800 dark:text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold py-7">Welcome back, Test Business!</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Total Orders
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                128
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Profit Accumulated
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                €3,420
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Average Rating:
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                4.8/5.0
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Active Services
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                3
                            </p>
                        </div>

                    </div>
                    {/* I might add like a recent activity tracker here, someone placed an order etc. */}
                    {/* If not it will need something though, looks a bit bare in full screen */}
                </div>
            </div>
        </div>
    )
}

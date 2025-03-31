import {getBusinessServices} from "@/db/services";
import {getAverageRatingForBusiness} from "@/db/reviews";
import {getProfitForBusiness, getTotalOrdersForBusiness} from "@/db/orders";
import {getBusinessName} from "@/db/business";

export default async function BPOverview() {
    const businessName = await getBusinessName();
    const services = await getBusinessServices();
    const serviceCount = services.length;
    const averageRating = getAverageRatingForBusiness();
    const totalOrders = getTotalOrdersForBusiness();
    const profit = getProfitForBusiness();

    return (
        <div className="flex w-full h-[calc(100vh-4em)] bg-gradient-to-b bg-blue-200 from-white dark:from-blue-950 dark:bg-background">
            <div className="py-16 px-36 md:py-8 md:px-18 w-full">
                <div className="space-y-8 text-gray-800 dark:text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold py-7">Welcome back, {businessName}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Total Orders
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                {totalOrders}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Profit Accumulated
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                ${profit}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Average Rating:
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                {averageRating}/5.0
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                Active Services
                            </h3>
                            <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                {serviceCount}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

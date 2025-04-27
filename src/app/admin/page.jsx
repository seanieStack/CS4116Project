import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/APNav";

export default async function AdminPanel() {

    const totalOrders = await prisma.order.count();
    const totalMessages = await prisma.message.count();
    const totalReviews = await prisma.review.count();
    const totalServices = await prisma.service.count();

    return (
        <>
            <Navbar />
            <AdminNav />
            <div className="flex w-full h-[calc(100vh-11em)] bg-gradient-to-b bg-blue-200 from-white dark:from-blue-950 dark:bg-background">
                <div className="py-16 px-36 md:py-8 md:px-18 w-full">
                    <div className="space-y-8 text-gray-800 dark:text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold py-7">Welcome back, admin</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                    Total Users
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                    {totalOrders}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                    Total Messages
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                    {totalMessages}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                    Total Reviews
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                    {totalReviews}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 h-40 flex flex-col text-center pt-3 pb-4">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                    Total Services
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-6">
                                    {totalServices}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
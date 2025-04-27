import Navbar from "@/components/Navbar";
import ReviewsList from "@/components/ReviewsList";
//import MessagesList from "@/components/MessagesList";
import ServicesList from "@/components/ServicesList";
import Footer from "@/components/Footer";
import {prisma} from "@/lib/prisma";
import AdminNav from "@/components/APNav";
import UsersList from "@/components/UsersList";

export default async function AdminPanel() {
    const reviews = await prisma.review.findMany();
    //const messages = await prisma.message.findMany();
    const services = await prisma.service.findMany();
    const buyers = await prisma.buyer.findMany();

    return (
        <>
            <Navbar />
            <AdminNav />
            <div className="mx-auto px-6 py-12 bg-gradient-to-b from-blue-100 to-white dark:from-blue-950 dark:to-gray-900 text-gray-800 dark:text-white">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold">Admin Panel</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your reviews, messages, and services here.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                        <ReviewsList reviews={reviews} />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-semibold mb-4">Services</h2>
                        <ServicesList services={services} />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-semibold mb-4">Users</h2>
                        <UsersList buyers={buyers} />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
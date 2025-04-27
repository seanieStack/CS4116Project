import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/APNav";

export default async function AdminPanel() {
    const reviews = await prisma.review.findMany();
    const messages = await prisma.message.findMany();
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
            </div>
            <Footer />
        </>
    );
}
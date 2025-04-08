import Navbar from "@/components/Navbar";
import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import logger from "@/util/logger";
import Footer from "@/components/Footer";
import OrdersList from "@/components/OrderList";

export default async function Orders() {
    const session = await getCurrentSessionInfo();

    if (!session) {
        logger.log("No active session found, redirecting to login page");
        redirect("/login");
    }

    if (session.role !== "BUYER"){
        logger.log("User is not a buyer, redirecting to home page");
        redirect("/");
    }

    const user = await getCurrentUser();

    return (
        <>
            <Navbar/>
            <div className="min-h-[calc(100vh-4em)] bg-gradient-to-b from-white to-blue-200 dark:from-blue-950 dark:to-background py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Orders</h1>
                    <OrdersList userId={user.id} />
                </div>
            </div>
            <Footer />
        </>
    );
}
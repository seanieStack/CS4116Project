import Navbar from "@/components/Navbar";
import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import BuyerProfileCard from "@/components/BuyerProfileCard";
import BusinessProfileCard from "@/components/BusinessProfileCard";
import {redirect} from "next/navigation";
import logger from "@/util/logger";

export default async function profile() {

    const session = await getCurrentSessionInfo();

    if (!session) {
        logger.log("No active session found, redirecting to login page");
        redirect("/login");
    }

    const user = await getCurrentUser();

    if (!user) {
        logger.error(`Session exists (${session.role}) but user data couldn't be retrieved`);
        return (
            <>
                <Navbar />
                <div className="flex w-full h-[calc(100vh-4em)] justify-center items-center bg-gradient-to-b from-white to-blue-200 dark:from-blue-950 dark:to-background">
                    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold text-center mb-4">Account Error</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            We couldn't retrieve your account information. Please try signing out and back in.
                        </p>
                    </div>
                </div>
            </>
        );
    }


    return (
        <>
            <Navbar/>
            <div
                className="flex w-full h-[calc(100vh-4em)] justify-center items-center bg-gradient-to-b bg-blue-200 from-white dark:from-blue-950 dark:bg-background dark:">
                <div className="w-min h-min overflow-hidden">
                    {session.role === "BUSINESS" ? (
                        <BusinessProfileCard user={user}/>
                    ): (
                        <BuyerProfileCard user={user} />
                    )}
                </div>
            </div>
        </>
    )
}
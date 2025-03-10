import Navbar from "@/components/Navbar";
import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import BuyerProfileCard from "@/components/BuyerProfileCard";
import BusinessProfileCard from "@/components/BusinessProfileCard";

export default async function profile() {

    const user = await getCurrentUser();
    const session = await getCurrentSessionInfo();


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
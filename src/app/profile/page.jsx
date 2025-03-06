import Navbar from "@/components/Navbar";
import {getCurrentUser} from "@/auth/nextjs/currentUser";
import BuyerProfileCard from "@/components/BuyerProfileCard";

export default async function profile() {

    const user = await getCurrentUser();


    return (
        <>
            <Navbar/>
            <div
                className="flex w-full h-[calc(100vh-4em)] justify-center items-center bg-gradient-to-b bg-blue-200 from-white dark:from-blue-950 dark:bg-background dark:">
                <div className="w-min h-min overflow-hidden">
                    <BuyerProfileCard user={user} />
                </div>
            </div>
        </>
    )
}
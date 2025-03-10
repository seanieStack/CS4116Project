import Navbar from "@/components/Navbar";
import RegisterCard from "@/components/RegisterCard";
import {redirect} from "next/navigation";
import {getCurrentSessionInfo} from "@/auth/nextjs/currentUser";

export default async function login() {

    if (await getCurrentSessionInfo() !== null) {
        redirect("/")
    }

    return (
        <>
            <Navbar/>
            <div
                className="flex w-full h-[calc(100vh-4em)] justify-center items-center bg-gradient-to-b bg-blue-200 from-white dark:from-blue-950 dark:bg-background dark:">
                <div className="w-min h-min overflow-hidden">
                    <RegisterCard/>
                </div>
            </div>
        </>
    )
}
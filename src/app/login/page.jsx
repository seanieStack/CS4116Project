import Navbar from "@/components/Navbar";
import LoginCard from "@/components/LoginCard";

export default function login(){
    return (
        <>
            <Navbar/>
            <div className="flex w-full h-[calc(100vh-4em)] justify-center items-center bg-gradient-to-b bg-blue-200 from-white dark:from-blue-950 dark:bg-background dark:">
                <div className="w-min h-min overflow-hidden">
                    <LoginCard />
                </div>
            </div>
        </>
    )
}
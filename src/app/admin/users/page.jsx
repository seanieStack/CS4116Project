import Navbar from "@/components/Navbar";
import AdminNav from "@/components/APNav";
import UsersList from "@/components/UsersList";
import {prisma} from "@/lib/prisma";
import Footer from "@/components/Footer";

export default async function UsersPage() {

    const users = await prisma.buyer.findMany();

    return (
        <>
            <Navbar/>
            <AdminNav/>
            <div
                className="mx-auto min-h-[calc(100vh-11em)] px-6 py-12 bg-gradient-to-b from-blue-200 dark:from-blue-950 text-white">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Users</h2>
                    <UsersList buyers={users}/>
                </div>
            </div>
            <Footer/>
        </>
    );
}
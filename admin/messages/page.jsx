import Navbar from "@/components/Navbar";
import AdminNav from "@/components/APNav";
import MessagesList from "@/components/MessagesList";
import Footer from "@/components/Footer";
import {prisma} from "@/lib/prisma";

export default async function MessagesPage() {

    const messages = await prisma.message.findMany()

    return (
        <>
            <Navbar/>
            <AdminNav/>
            <div
                className="mx-auto min-h-[calc(100vh-11em)] px-6 py-12 bg-gradient-to-b from-blue-200 dark:from-blue-950 text-white">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Messages</h2>
                    <MessagesList messages={messages} />
                </div>
            </div>
            <Footer/>
        </>
    );
}
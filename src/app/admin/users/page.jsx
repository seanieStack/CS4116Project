import Navbar from "@/components/Navbar";
import AdminNav from "@/components/APNav";
import UsersList from "@/components/UsersList";
import Footer from "@/components/Footer";

export default function UsersPage() {
    return (
        <>
            <Navbar />
            <AdminNav />
            <div className="container mx-auto px-6 py-12 bg-gradient-to-b from-blue-200 dark:from-blue-950 text-white">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Services</h2>
                    <UsersList />
                </div>
            </div>
            <Footer />
        </>
    );
}
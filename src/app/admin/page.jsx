import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsList from "@/components/ReviewsList";
import MessagesList from "@/components/MessagesList";
import ServicesList from "@/components/ServicesList";
import AdminNav from "@/components/AdminNav";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('messages');

    return (
        <>
            <Navbar />
            <AdminNav />
            <div className="container mx-auto px-6 py-12 bg-gradient-to-b from-blue-200 dark:from-blue-950 text-white">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    {activeTab === 'messages' && (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">Messages</h2>
                            <MessagesList />
                        </>
                    )}
                    {activeTab === 'reviews' && (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                            <ReviewsList />
                        </>
                    )}
                    {activeTab === 'services' && (
                        <>
                            <h2 className="text-2xl font-semibold mb-4">Services</h2>
                            <ServicesList />
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
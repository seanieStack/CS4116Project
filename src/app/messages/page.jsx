"use client"

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import logger from "@/util/logger";

export default function MessagesListPage() {
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch('/api/user/current');
                const data = await response.json();

                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }

                const sessionRes = await fetch('/api/session');
                const sessionData = await sessionRes.json();
                if (sessionData.session) {
                    setSession(sessionData.session);
                }
            } catch (err) {
                logger.error("Error fetching user data:", err);
                setError("Authentication error. Please try logging in again.");
            }
        }

        fetchUserData();
    }, [router]);

    useEffect(() => {
        if (!user || !session) return;

        async function fetchConversations() {
            try {
                setLoading(true);
                const role = session.role.toLowerCase();
                const response = await fetch(`/api/conversations?role=${role}`);

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setConversations(data.conversations || []);
            } catch (err) {
                logger.error("Error fetching conversations:", err);
                setError("Failed to load messages");
            } finally {
                setLoading(false);
            }
        }

        fetchConversations();
    }, [user, session]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }

        return date.toLocaleDateString();
    };

    const getLatestMessage = (conversation) => {
        if (!conversation.messages || conversation.messages.length === 0) {
            return { content: "No messages yet", created_at: conversation.created_at };
        }
        return conversation.messages[0];
    };

    const getPartnerInfo = (conversation) => {
        if (session?.role === 'BUYER') {
            return {
                name: conversation.business.name,
                image: conversation.business.logo
            };
        } else {
            return {
                name: conversation.buyer.name,
                image: conversation.buyer.profile_img
            };
        }
    };

    if (loading) {
        return (
                <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-100 to-white dark:from-blue-950 dark:to-gray-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
        );
    }

    return (
            <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-100 to-white dark:from-blue-950 dark:to-gray-900 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    {conversations.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                            <ChatBubbleLeftIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                            <p className="text-gray-600 dark:text-gray-300 mb-4">You don't have any messages yet</p>
                            <Link href="/services" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                Browse Services
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {conversations.map((conversation) => {
                                const partnerInfo = getPartnerInfo(conversation);
                                const latestMessage = getLatestMessage(conversation);

                                return (
                                    <Link
                                        href={`/messages/${conversation.id}`}
                                        key={conversation.id}
                                        className="block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
                                    >
                                        <div className="flex items-start">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex-shrink-0 mr-4 overflow-hidden">
                                                {partnerInfo.image ? (
                                                    <img
                                                        src={partnerInfo.image}
                                                        alt={partnerInfo.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                                                        {partnerInfo.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                        {partnerInfo.name}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatTime(latestMessage.created_at)}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 dark:text-gray-300 mt-1 truncate">
                                                    {latestMessage.content}
                                                </p>

                                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                    <span>Re: </span>
                                                    <span className="text-blue-500 dark:text-blue-400 ml-1 truncate">
                                                        {conversation.service.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
    );
}
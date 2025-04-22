"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import logger from "@/util/logger";

export default function ConversationPage({ params }) {
    const conversationId = params.id;
    const router = useRouter();
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const messagesEndRef = useRef(null);

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
        if (!user) return;

        async function fetchConversation() {
            try {
                setLoading(true);
                const response = await fetch(`/api/messages?conversationId=${conversationId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        // router.push('/messages');
                        return;
                    }
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setConversation(data.conversation);
                setMessages(data.messages);
            } catch (err) {
                logger.error("Error fetching conversation:", err);
                setError("Failed to load conversation");
            } finally {
                setLoading(false);
            }
        }

        fetchConversation();

        const pollingInterval = setInterval(() => {
            if (user) fetchConversation();
        }, 5000);

        return () => clearInterval(pollingInterval);
    }, [conversationId, user, router]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        try {
            setSending(true);
            setError("");

            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId,
                    content: newMessage
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            const data = await response.json();
            setMessages(prev => [...prev, data.message]);
            setNewMessage("");

        } catch (err) {
            logger.error("Error sending message:", err);
            setError(err.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const groupedMessages = messages.reduce((groups, message) => {
        const date = formatDate(message.created_at);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    if (loading) {
        return (
                <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-100 to-white dark:from-blue-950 dark:to-gray-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
        );
    }

    return (
            <div className="flex flex-col min-h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-100 to-white dark:from-blue-950 dark:to-gray-900">
                <div className="container mx-auto p-4 flex-1 flex flex-col">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                            <button
                                onClick={() => router.push('/messages')}
                                className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>

                            {conversation && (
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex-shrink-0 mr-3 overflow-hidden">
                                        {session?.role === 'BUYER' ? (
                                            conversation.business.logo ? (
                                                <img
                                                    src={conversation.business.logo}
                                                    alt={conversation.business.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                                                    {conversation.business.name.charAt(0).toUpperCase()}
                                                </div>
                                            )
                                        ) : (
                                            conversation.buyer.profile_img ? (
                                                <img
                                                    src={conversation.buyer.profile_img}
                                                    alt={conversation.buyer.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                                                    {conversation.buyer.name.charAt(0).toUpperCase()}
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900 dark:text-white">
                                            {session?.role === 'BUYER' ? conversation.business.name : conversation.buyer.name}
                                        </h2>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                            <span>Re: </span>
                                            <Link href={`/services/${conversation.service.id}`} className="hover:underline text-blue-500 dark:text-blue-400 ml-1">
                                                {conversation.service.name}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            {error && (
                                <div className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 p-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                                <div key={date}>
                                    <div className="flex justify-center my-4">
                                        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                            {date}
                                        </span>
                                    </div>

                                    {dateMessages.map((message) => {
                                        const isOwn = (
                                            (session?.role === 'BUYER' && message.senderType === 'BUYER') ||
                                            (session?.role === 'BUSINESS' && message.senderType === 'BUSINESS')
                                        );

                                        return (
                                            <div
                                                key={message.id}
                                                className={`mb-4 flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                    isOwn
                                                        ? 'bg-blue-500 text-white rounded-br-none'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                                                }`}>
                                                    <p className="break-words">{message.content}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        isOwn
                                                            ? 'text-blue-100'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                        {formatTime(message.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <form onSubmit={handleSendMessage} className="flex">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-l-lg focus:outline-none"
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none disabled:bg-blue-300 dark:disabled:bg-blue-700"
                                    disabled={sending || !newMessage.trim()}
                                >
                                    {sending ? (
                                        <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    ) : (
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
}
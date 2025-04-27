"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import logger from "@/util/logger";

export default function BPMessages() {
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);
    const [reply, setReply] = useState("");
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [readConversations, setReadConversations] = useState([]);

    const readConversationsRef = useRef(readConversations);
    const initialFetchComplete = useRef(false);

    useEffect(() => {
        readConversationsRef.current = readConversations;
    }, [readConversations]);

    useEffect(() => {
        async function fetchConversations() {
            try {
                if (!initialFetchComplete.current) {
                    setInitialLoading(true);
                } else {
                    setRefreshing(true);
                }

                const response = await fetch('/api/conversations?role=business');

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setConversations(data.conversations || []);

                const readIds = new Set(readConversationsRef.current);
                data.conversations.forEach(conv => {
                    if (conv.messages && conv.messages.length > 0) {
                        const latestMessage = conv.messages[0];
                        if (latestMessage.senderType === 'BUYER' && latestMessage.read) {
                            readIds.add(conv.id);
                        }
                    }
                });

                setReadConversations(Array.from(readIds));
                initialFetchComplete.current = true;
            } catch (err) {
                logger.error("Error fetching conversations:", err);
                setError("Failed to load conversations");
            } finally {
                setInitialLoading(false);
                setRefreshing(false);
            }
        }

        fetchConversations();

        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!activeConversation) return;

        async function fetchMessages() {
            try {
                const response = await fetch(`/api/messages?conversationId=${activeConversation.id}`);

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setActiveMessages(data.messages || []);

                if (!readConversations.includes(activeConversation.id)) {
                    setReadConversations(prev => [...prev, activeConversation.id]);
                }
            } catch (err) {
                logger.error("Error fetching messages:", err);
                setError("Failed to load messages");
            }
        }

        fetchMessages();
    }, [activeConversation, readConversations]);

    const handleSendReply = async () => {
        if (!reply.trim() || !activeConversation) return;

        try {
            setSending(true);
            setError("");

            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeConversation.id,
                    content: reply
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            const data = await response.json();

            setActiveMessages(prev => [...prev, data.message]);
            setReply("");

        } catch (err) {
            logger.error("Error sending reply:", err);
            setError(err.message || "Failed to send reply");
        } finally {
            setSending(false);
        }
    };

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

    const openFullConversation = (conversationId) => {
        router.push(`/messages/${conversationId}`);
    };

    const closeConversation = () => {
        setActiveConversation(null);
        setActiveMessages([]);
        setReply("");
    };

    return (
        <div className="flex flex-col w-full min-h-[calc(100vh-8em)] bg-gradient-to-b from-white to-blue-200 dark:from-blue-950 dark:to-background py-6 px-2 sm:px-6 md:px-10">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Messages
            </h1>

            {initialLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : conversations.length === 0 ? (
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-300">No conversations yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {conversations.map((conversation) => {
                        const latestMessage = getLatestMessage(conversation);
                        const isUnread = !readConversations.includes(conversation.id) &&
                            latestMessage.senderType === 'BUYER';

                        return (
                            <div
                                key={conversation.id}
                                onClick={() => {
                                    setActiveConversation(conversation);
                                    if (!readConversations.includes(conversation.id)) {
                                        setReadConversations(prev => [...prev, conversation.id]);
                                    }
                                }}
                                className={`relative cursor-pointer bg-white dark:bg-neutral-800 rounded-xl shadow-md p-4 border hover:border-blue-500 transition ${
                                    activeConversation?.id === conversation.id
                                        ? "border-blue-500"
                                        : "border-transparent"
                                }`}
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex-shrink-0 mr-3 overflow-hidden">
                                        {conversation.buyer.profile_img ? (
                                            <img
                                                src={conversation.buyer.profile_img}
                                                alt={conversation.buyer.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                                                {conversation.buyer.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-gray-800 dark:text-white">
                                                {conversation.buyer.name}
                                            </h3>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatTime(latestMessage.created_at)}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                            {latestMessage.content}
                                        </p>

                                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="text-blue-500 dark:text-blue-400">
                                                Re: {conversation.service.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {isUnread && (
                                    <span className="absolute top-3 right-4 h-3 w-3 bg-blue-500 rounded-full" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {activeConversation && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800 flex-shrink-0 mr-3 overflow-hidden">
                                    {activeConversation.buyer.profile_img ? (
                                        <img
                                            src={activeConversation.buyer.profile_img}
                                            alt={activeConversation.buyer.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                                            {activeConversation.buyer.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-white">
                                        {activeConversation.buyer.name}
                                    </h2>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Re: {activeConversation.service.name}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openFullConversation(activeConversation.id)}
                                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                                >
                                    View Full
                                </button>
                                <button
                                    onClick={closeConversation}
                                    className="p-2 text-gray-500 hover:text-red-500 text-xl"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-4 max-h-[50vh] overflow-y-auto">
                            {error && (
                                <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            {activeMessages.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No messages yet. Send a message to start the conversation.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {activeMessages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`p-3 rounded-xl max-w-[80%] ${
                                                message.senderType === 'BUSINESS'
                                                    ? 'bg-blue-100 dark:bg-blue-700 text-gray-800 dark:text-white ml-auto'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                                            }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                                                {formatTime(message.created_at)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex w-full gap-2">
                                <input
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    type="text"
                                    placeholder="Type a reply..."
                                    className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-800 dark:text-white"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSendReply}
                                    disabled={!reply.trim() || sending}
                                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Send"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {refreshing && (
                <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                </div>
            )}
        </div>
    );
}
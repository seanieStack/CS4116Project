"use client";

import { useEffect, useState } from "react";

const mockBusiness = {
    id: "1",
    name: "Test Business",
};

const mockBuyers = [
    { id: "2", name: "John Doe" },
    { id: "3", name: "Jane Smith" },
];

const mockMessages = [
    {
        id: "msg-1",
        content: "This is test 1",
        created_at: "2024-03-21T10:30:00Z",
        senderId: "2",
        receiverId: "1",
    },
    {
        id: "msg-2",
        content: "Test number 1",
        created_at: "2024-03-21T10:35:00Z",
        senderId: "1",
        receiverId: "2",
    },
    {
        id: "msg-3",
        content: "This is test 2",
        created_at: "2024-03-22T09:15:00Z",
        senderId: "3",
        receiverId: "1",
    },
    {
        id: "msg-4",
        content: "Test number 2",
        created_at: "2024-03-22T09:30:00Z",
        senderId: "1",
        receiverId: "3",
    },
];

export default function BPMessages() {
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [reply, setReply] = useState("");
    const [readConversations, setReadConversations] = useState([]);

    useEffect(() => {
        const relevantMessages = mockMessages.filter(
            (msg) =>
                msg.senderId === mockBusiness.id || msg.receiverId === mockBusiness.id
        );
        setMessages(relevantMessages);
    }, []);

    const getBuyerById = (id) => mockBuyers.find((b) => b.id === id);
    const getConversationPartners = () => {
        const partnerIds = new Set();
        messages.forEach((msg) => {
            const partnerId =
                msg.senderId === mockBusiness.id ? msg.receiverId : msg.senderId;
            partnerIds.add(partnerId);
        });
        return Array.from(partnerIds).map((id) => ({
            id,
            name: getBuyerById(id)?.name || "Unknown Buyer",
            latestMessage: getLatestMessageWithBuyer(id),
        }));
    };

    const getLatestMessageWithBuyer = (buyerId) => {
        const convMessages = messages.filter(
            (msg) =>
                (msg.senderId === buyerId && msg.receiverId === mockBusiness.id) ||
                (msg.receiverId === buyerId && msg.senderId === mockBusiness.id)
        );
        return convMessages.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[convMessages.length - 1];
    };

    const getConversationWithBuyer = (buyerId) =>
        messages
            .filter(
                (msg) =>
                    (msg.senderId === buyerId && msg.receiverId === mockBusiness.id) ||
                    (msg.receiverId === buyerId && msg.senderId === mockBusiness.id)
            )
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    const handleSendReply = () => {
        if (!reply.trim()) return;

        const newMessage = {
            id: `msg-${Date.now()}`,
            content: reply,
            created_at: new Date().toISOString(),
            senderId: mockBusiness.id,
            receiverId: activeConversation.id,
        };

        setMessages((prev) => [...prev, newMessage]);
        setReply("");
    };

    const closeConversation = () => {
        setActiveConversation(null);
        setReply("");
    };

    return (
        <div className="flex flex-col w-full min-h-[calc(100vh-4em)] bg-gradient-to-b from-white to-blue-200 dark:from-blue-950 dark:to-background p-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                Messages
            </h1>

            <div className="flex flex-col gap-6">
                {getConversationPartners().map((partner) => (
                    <div
                        key={partner.id}
                        onClick={() => {
                            setActiveConversation(partner);
                            setReadConversations((prev) =>
                                prev.includes(partner.id) ? prev : [...prev, partner.id]
                            );
                        }}
                        className={`relative cursor-pointer bg-white dark:bg-neutral-800 rounded-xl shadow-md p-4 border hover:border-blue-500 transition ${
                            activeConversation?.id === partner.id
                                ? "border-blue-500"
                                : "border-transparent"
                        }`}
                    >
                        <div className="font-medium text-gray-800 dark:text-white">
                            {partner.name}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {partner.latestMessage?.content}
                        </p>

                        {!readConversations.includes(partner.id) &&
                            partner.latestMessage?.senderId !== mockBusiness.id && (
                                <span className="absolute top-3 right-4 h-3 w-3 bg-blue-500 rounded-full" />
                            )}
                    </div>
                ))}
            </div>

            {activeConversation && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <button
                            onClick={closeConversation}
                            className="p-3 font-bold absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
                        >
                            x
                        </button>

                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Conversation with {activeConversation.name}
                            </h2>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4 pr-2">
                                {getConversationWithBuyer(activeConversation.id).map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`p-3 rounded-xl max-w-[80%] ${
                                            msg.senderId === mockBusiness.id
                                                ? "bg-blue-100 dark:bg-blue-700 ml-auto text-right"
                                                : "bg-gray-100 dark:bg-neutral-700"
                                        }`}
                                    >
                                        <p className="text-sm text-gray-800 dark:text-white">
                                            {msg.content}
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                                          {new Date(msg.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex w-full gap-2">
                                <input
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    type="text"
                                    placeholder="Type a reply..."
                                    className="w-full px-4 py-3 rounded-lg border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-800 dark:text-white"
                                />
                                <button
                                    onClick={handleSendReply}
                                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
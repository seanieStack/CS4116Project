"use client"

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import logger from "@/util/logger";
import ServiceReviews from "@/components/ServiceReviews";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

export default function ServiceViewer({ service }) {
    const router = useRouter();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [isBuyer, setIsBuyer] = useState(false);

    useEffect(() => {
        async function fetchUserAndOrderData() {
            try {
                setLoading(true);
                const userData = await fetch('/api/user/current').then(res => res.json());
                const sessionRes = await fetch('/api/session').then(res => res.json());

                setUser(userData.user);
                setSession(sessionRes.session);

                const isUserBuyer = sessionRes.session?.role === "BUYER";
                setIsBuyer(isUserBuyer);

                if (userData.user && isUserBuyer) {
                    const orderCheck = await fetch(`/api/orders/check?serviceId=${service.id}&userId=${userData.user.id}`);
                    const orderData = await orderCheck.json();
                    setHasPurchased(orderData.hasPurchased);

                    const reviewCheck = await fetch(`/api/reviews/check?serviceId=${service.id}&userId=${userData.user.id}`);
                    const reviewData = await reviewCheck.json();
                    setReviewSubmitted(reviewData.hasReviewed);

                    try {
                        const conversationsResponse = await fetch('/api/conversations?role=buyer');
                        if (conversationsResponse.ok) {
                            const conversationsData = await conversationsResponse.json();
                            const existingConversation = conversationsData.conversations?.find(
                                conv => conv.serviceId === service.id && conv.businessId === service.businessId
                            );
                            if (existingConversation) {
                                setConversation(existingConversation);
                            }
                        }
                    } catch (err) {
                        logger.error("Error checking for existing conversations:", err);
                    }
                }
            } catch (err) {
                logger.error("Error fetching user or order data:", err);
                setError("Failed to verify purchase history");
            } finally {
                setLoading(false);
            }
        }

        fetchUserAndOrderData();
    }, [service.id, service.businessId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!user || !isBuyer) {
            setError("You must be logged in as a buyer to submit a review");
            return;
        }

        if (!hasPurchased) {
            setError("You must purchase this service before reviewing it");
            return;
        }

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    businessId: service.businessId,
                    serviceId: service.id,
                    comment: review,
                    rating: rating,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit review");
            }

            setReview('');
            setRating(0);
            setReviewSubmitted(true);
            setError("");
        } catch (error) {
            logger.error('Error submitting review:', error);
            setError(error.message || "Failed to submit your review");
        } finally {
            setLoading(false);
        }
    };

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        if (!user || !isBuyer) {
            setError("You must be logged in as a buyer to send a message");
            return;
        }

        if (!message.trim()) {
            setError("Please enter a message");
            return;
        }

        try {
            setSendingMessage(true);
            setError("");

            if (!conversation) {
                const conversationResponse = await fetch('/api/conversations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        serviceId: service.id,
                        businessId: service.businessId
                    })
                });

                if (!conversationResponse.ok) {
                    const errorData = await conversationResponse.json();
                    throw new Error(errorData.error || "Failed to create conversation");
                }

                const conversationData = await conversationResponse.json();
                setConversation(conversationData.conversation);

                await sendMessage(conversationData.conversation.id);
            } else {
                await sendMessage(conversation.id);
            }

            setMessage('');
            setMessageSuccess(true);
            setTimeout(() => setMessageSuccess(false), 3000);
        } catch (err) {
            logger.error('Error sending message:', err);
            setError(err.message || "Failed to send your message");
        } finally {
            setSendingMessage(false);
        }
    };

    const sendMessage = async (conversationId) => {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: conversationId,
                content: message
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to send message");
        }

        return await response.json();
    };

    const openConversation = () => {
        if (conversation) {
            router.push(`/messages/${conversation.id}`);
        }
    };

    return (
        <div className="flex overflow-auto bg-gradient-to-b min-h-[calc(100vh-8em)] from-blue-100 to-white dark:from-blue-950 dark:to-gray-900">
            <div className="container mx-auto p-6 mt-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="md:col-span-1">
                            <div className="w-full bg-blue-100 dark:bg-blue-600 flex items-center justify-center aspect-square rounded-lg">
                                <img
                                    src={service?.image}
                                    alt={service?.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex items-center mb-2">
                                <h2 className="font-bold text-xl">{service?.name}</h2>
                                <div className="ml-2 bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    €{service?.price}
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">{service?.description || "No description available"}</p>

                            <button
                                className={`${
                                    user && isBuyer
                                        ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                        : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                } text-white px-4 py-2 rounded mb-8`}
                                onClick={() => {
                                    if (user && isBuyer) {
                                        redirect(`/purchase/${service?.id}`);
                                    }
                                }}
                                disabled={!user || !isBuyer}
                            >
                                {user && isBuyer
                                    ? `Purchase Now - €${service?.price}`
                                    : "Sign in as buyer to purchase"}
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {user && isBuyer && (
                                    <>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-3">Contact the Business</h4>
                                            {conversation && conversation.messages && conversation.messages.length > 0 ? (
                                                <div>
                                                    <button
                                                        onClick={openConversation}
                                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                    >
                                                        <ChatBubbleLeftIcon className="h-5 w-5" />
                                                        <span>View Conversation</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleMessageSubmit}>
                                                    {error && error.includes("message") && (
                                                        <div className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-white p-2 mb-3 rounded-lg text-sm">
                                                            {error}
                                                        </div>
                                                    )}

                                                    {messageSuccess && (
                                                        <div className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-white p-2 mb-3 rounded-lg text-sm">
                                                            Message sent successfully!
                                                        </div>
                                                    )}

                                                    <textarea
                                                        className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                                        placeholder="Your message to the business"
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        rows={6}
                                                        disabled={sendingMessage}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
                                                        disabled={sendingMessage}
                                                    >
                                                        {sendingMessage ? "Sending..." : "Send Message"}
                                                    </button>
                                                </form>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-lg mb-3">Leave a Review</h4>
                                            {!hasPurchased && (
                                                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 text-center">
                                                    <p>You need to purchase this service before you can review it</p>
                                                </div>
                                            )}

                                            {hasPurchased && reviewSubmitted && (
                                                <div className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-white p-4 rounded-lg mb-4 text-center">
                                                    <p>Thank you for your review!</p>
                                                </div>
                                            )}

                                            {hasPurchased && !reviewSubmitted && (
                                                <form onSubmit={handleReviewSubmit}>
                                                    {error && error.includes("review") && (
                                                        <div className="bg-red-100 text-red-800 dark:bg-red-600 dark:text-white p-2 mb-3 rounded-lg text-sm">
                                                            {error}
                                                        </div>
                                                    )}
                                                    <textarea
                                                        className="w-full p-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                                        placeholder="Your review"
                                                        value={review}
                                                        onChange={(e) => setReview(e.target.value)}
                                                        rows={6}
                                                        disabled={loading}
                                                    />
                                                    <div className="flex items-center justify-between">
                                                        <button
                                                            type="submit"
                                                            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400 dark:disabled:bg-gray-500"
                                                            disabled={loading}
                                                        >
                                                            {loading ? "Submitting..." : "Submit Review"}
                                                        </button>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    className={`text-2xl ${star <= rating ? "text-amber-500 dark:text-yellow-500" : "text-gray-300 dark:text-gray-400"}`}
                                                                    onClick={() => setRating(star)}
                                                                    disabled={loading}
                                                                >
                                                                    ★
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </>
                                )}

                                {(!user || !isBuyer) && (
                                    <div className="md:col-span-2">
                                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 text-center">
                                            <p>Please sign in as a buyer to contact the business or leave reviews.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        {service && service.id && (
                            <ServiceReviews serviceId={service.id} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
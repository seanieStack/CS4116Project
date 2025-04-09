"use client"

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import logger from "@/util/logger";
import ServiceReviews from "@/components/ServiceReviews";

export default function ServiceViewer({ service }) {
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUserAndOrderData() {
            try {
                setLoading(true);
                const userData = await fetch('/api/user/current').then(res => res.json());

                if (userData.user) {
                    setUser(userData.user);

                    const orderCheck = await fetch(`/api/orders/check?serviceId=${service.id}&userId=${userData.user.id}`);
                    const orderData = await orderCheck.json();

                    setHasPurchased(orderData.hasPurchased);

                    const reviewCheck = await fetch(`/api/reviews/check?serviceId=${service.id}&userId=${userData.user.id}`);
                    const reviewData = await reviewCheck.json();

                    setReviewSubmitted(reviewData.hasReviewed);
                }
            } catch (err) {
                logger.error("Error fetching user or order data:", err);
                setError("Failed to verify purchase history");
            } finally {
                setLoading(false);
            }
        }

        fetchUserAndOrderData();
    }, [service.id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in to submit a review");
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

    const handleContactSubmit = (e) => {
        e.preventDefault();
        // Handle contact form submission logic here
    };

    return (
        <div className="flex overflow-auto bg-gradient-to-b min-h-[calc(100vh-8em)] from-blue-200 dark:from-blue-950">
            <div className="container mx-auto p-6 mt-4">
                <div className="border rounded-lg shadow-lg bg-gray-800 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        <div className="md:col-span-1">
                            <div className="w-full bg-blue-600 flex items-center justify-center aspect-square rounded-lg">
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
                                <div className="ml-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    ${service?.price}
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6">{service?.description || "No description available"}</p>

                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-8"
                                onClick={() => redirect(`/purchase/${service?.id}`)}
                            >
                                Purchase Now - ${service?.price}
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold text-lg mb-3">Contact the Business</h4>
                                    <form onSubmit={handleContactSubmit}>
                                        <textarea
                                            className="w-full p-2 mb-3 border rounded-lg text-black"
                                            placeholder="Your message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={6}
                                        />
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                            Send Message
                                        </button>
                                    </form>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-lg mb-3">Leave a Review</h4>

                                    {!user && (
                                        <div className="bg-gray-700 p-4 rounded-lg mb-4 text-center">
                                            <p>Please sign in to leave a review</p>
                                        </div>
                                    )}

                                    {user && !hasPurchased && (
                                        <div className="bg-gray-700 p-4 rounded-lg mb-4 text-center">
                                            <p>You need to purchase this service before you can review it</p>
                                        </div>
                                    )}

                                    {user && hasPurchased && reviewSubmitted && (
                                        <div className="bg-green-700 p-4 rounded-lg mb-4 text-center">
                                            <p>Thank you for your review!</p>
                                        </div>
                                    )}

                                    {user && hasPurchased && !reviewSubmitted && (
                                        <form onSubmit={handleReviewSubmit}>
                                            {error && (
                                                <div className="bg-red-600 p-2 mb-3 rounded-lg text-sm">
                                                    {error}
                                                </div>
                                            )}
                                            <textarea
                                                className="w-full p-2 mb-3 border rounded-lg text-black"
                                                placeholder="Your review"
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                rows={6}
                                                disabled={loading}
                                            />
                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-500"
                                                    disabled={loading}
                                                >
                                                    {loading ? "Submitting..." : "Submit Review"}
                                                </button>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
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

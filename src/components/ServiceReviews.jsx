"use client"

import { useState, useEffect } from "react";
import logger from "@/util/logger";

export default function ServiceReviews({ serviceId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReviews() {
            try {
                setLoading(true);
                const response = await fetch(`/api/reviews?serviceId=${serviceId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }

                const data = await response.json();
                setReviews(data.reviews || []);
            } catch (err) {
                logger.error("Error fetching reviews:", err);
                setError("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        }

        if (serviceId) {
            fetchReviews();
        }
    }, [serviceId]);

    if (loading) {
        return (
            <div className="mt-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-300">Loading reviews...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="mt-8 text-center">
                <p className="text-gray-300">No reviews yet</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <div className="flex-shrink-0 mr-3">
                                {review.customer.profile_img ? (
                                    <img
                                        src={review.customer.profile_img}
                                        alt={review.customer.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                        {review.customer.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="font-semibold">{review.customer.name}</p>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${i < review.rating ? "text-yellow-500" : "text-gray-500"}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-400">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {review.comment && (
                            <p className="text-gray-300 mt-2">{review.comment}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
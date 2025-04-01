"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ServiceViewer({ service }) {
    const router = useRouter();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        // try {
        //     const response = await fetch('/api/reviews', {
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify({
        //             businessId: business.id,
        //             review,
        //             rating,
        //         }),
        //     });
        //
        //     if (response.ok) {
        //         setReview('');
        //         setRating(0);
        //         alert('Review submitted successfully');
        //     } else {
        //         alert('Failed to submit review');
        //     }
        // } catch (error) {
        //     console.error('Error:', error);
        //     alert('An error occurred while submitting the review');
        // }
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        // Handle contact form submission logic here
    };

    return (
        <div className="flex overflow-auto bg-gradient-to-b h-[calc(100vh-8em)] from-blue-200 dark:from-blue-950">
            <div className="container mx-auto p-6 mt-4">
                <div className="border rounded-lg shadow-lg bg-gray-800 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                        {/* Left column with image */}
                        <div className="md:col-span-1">
                            <div className="w-full bg-blue-600 flex items-center justify-center aspect-square rounded-lg">
                                <img
                                    src={service?.image}
                                    alt={service?.name}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Middle and right columns for content */}
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
                                onClick={() => router.push("/purchase")}
                            >
                                Purchase Now - ${service?.price}
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Contact Form */}
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
                                    <form onSubmit={handleReviewSubmit}>
                                    <textarea
                                        className="w-full p-2 mb-3 border rounded-lg text-black"
                                        placeholder="Your review"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        rows={6}
                                    />
                                        <div className="flex items-center justify-between">
                                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                                Submit Review
                                            </button>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                                                        onClick={() => setRating(star)}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const { id } = context.params;
  const business = await prisma.business.findUnique({
    where: { id: parseInt(id) },
    include: { services: true },
  });

  return {
    props: { business },
  };
}

export default function BusinessPage({ business }) {
  const router = useRouter();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          review,
          rating,
        }),
      });

      if (response.ok) {
        setReview('');
        setRating(0);
        alert('Review submitted successfully');
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the review');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission logic here
  };

  return (
      <>
        <Navbar />
        <div className="container mx-auto p-6 bg-gradient-to-b from-blue-200 dark:from-blue-950">
          <div className="border p-4 rounded-lg shadow-lg bg-gray-800 text-white">
            <div className="h-32 flex items-center justify-center mb-4">
              <img
                  src={business.image || ""}
                  alt={business.name}
                  className="h-full w-auto object-contain"
              />
            </div>
            <h3 className="font-semibold">{business.name}</h3>
            <p className="text-gray-300">{business.description || "No description available"}</p>

            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-2">Contact the Business</h4>
              <form onSubmit={handleContactSubmit}>
              <textarea
                  className="w-full p-2 mb-4 border rounded-lg text-black"
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
              />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
              </form>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-2">Leave a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="flex mb-4">
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
                <textarea
                    className="w-full p-2 mb-4 border rounded-lg text-black"
                    placeholder="Your review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Review</button>
              </form>
            </div>

            <div className="mt-6">
              <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => router.push("/purchase")}
              >
                Purchase
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
  );
}
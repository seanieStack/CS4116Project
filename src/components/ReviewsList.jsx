import { useEffect, useState } from 'react';

export default function ReviewsList() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function fetchReviews() {
            const response = await fetch('/api/reviews');
            const data = await response.json();
            setReviews(data.reviews);
        }
        fetchReviews();
    }, []);

    return (
        <table className="min-w-full bg-white">
            <thead>
            <tr>
                <th className="py-2">Business ID</th>
                <th className="py-2">Review</th>
                <th className="py-2">Rating</th>
            </tr>
            </thead>
            <tbody>
            {reviews.map((review) => (
                <tr key={review.id}>
                    <td className="py-2">{review.businessId}</td>
                    <td className="py-2">{review.review}</td>
                    <td className="py-2">{review.rating}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
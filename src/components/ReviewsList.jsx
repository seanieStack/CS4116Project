
import { useEffect, useState } from 'react';

export default function ReviewsList() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch('/api/reviews')
            .then(response => response.json())
            .then(data => setReviews(data));
    }, []);

    return (
        <div className="bg-white dark:bg-neutral-800">
            <table>
                <thead>
                <tr>
                    <th className="text-black dark:text-white">ID</th>
                    <th className="text-black dark:text-white">Review</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map(review => (
                    <tr key={review.id}>
                        <td className="text-black dark:text-white">{review.id}</td>
                        <td className="text-black dark:text-white">{review.content}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
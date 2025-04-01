export default function ReviewsList({reviews}) {
    return (
        <table className="min-w-full bg-white text-black">
            <thead>
            <tr>
                <th className="py-2">Business ID</th>
                <th className="py-2">Review</th>
                <th className="py-2">Rating</th>
            </tr>
            </thead>
            <tbody>
            {reviews.map((review) => (
                <tr key={review.id} className="py-2 border border-gray-200">
                    <td className="py-2">{review.businessId}</td>
                    <td className="py-2">{review.comment}</td>
                    <td className="py-2">{review.rating}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
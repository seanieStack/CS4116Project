export default function ReviewsList({ reviews }) {
    return (
        <div className="overflow-x-auto p-4">
            <div className="bg-gray-700 shadow-lg rounded-lg p-4">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-600">
                        <tr>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Business ID
                            </th>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Review
                            </th>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Rating
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-700 divide-y divide-gray-600">
                        {reviews.map((review) => (
                            <tr key={review.id}>
                                <td className="px-6 py-4">{review.businessId}</td>
                                <td className="px-6 py-4">{review.comment}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        {review.rating} ★
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

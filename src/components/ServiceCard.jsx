import Link from "next/link";

export default function ServiceCard({ service }) {
    const rating = service.rating;

    return (
        <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:shadow-xl transition-shadow duration-300">
            <Link href={`/services/${service.id}`}>
                <div className="h-32 flex items-center justify-center mb-4">
                    <img
                        src={service.image}
                        alt={service.name}
                        className="h-full w-auto object-contain"
                    />
                </div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{service.description || "No description available"}</p>
                <div className="mt-4 flex justify-between items-end">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">€{service.price.toFixed(2)}</p>
                    <div className="text-right">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {service.business?.name || "Unknown Business"}
                        </p>

                        <div className="flex items-center mt-1 justify-end">
                            {rating !== null && (
                                [1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className="text-2xl cursor-pointer text-amber-500 dark:text-amber-400"
                                    >
                                        {rating >= star ? '★' : '☆'}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
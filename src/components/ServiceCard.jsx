import Link from "next/link";

export default function ServiceCard({ service }) {
    return (
        <div className="border p-4 rounded-lg shadow-lg bg-gray-800 text-white hover:shadow-xl transition-shadow duration-300">
            <Link href={`/services/${service.id}`}>
                <div className="h-32 flex items-center justify-center mb-4">
                    <img
                        src={service.image}
                        alt={service.name}
                        className="h-full w-auto object-contain"
                    />
                </div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-gray-300 mt-2 line-clamp-2">{service.description || "No description available"}</p>
                <div className="mt-4 flex justify-between items-end">
                    <p className="text-lg font-bold text-blue-400">€{service.price.toFixed(2)}</p>
                    <div className="text-right">
                        <p className="text-gray-400 text-sm">
                            {service.business?.name || "Unknown Business"}
                        </p>
                        {service.rating && (
                            <div className="flex items-center mt-1 justify-end">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span>{service.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
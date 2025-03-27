"use client";

export default function BPServiceCard({ service, onEdit, onDelete }) {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-4 transition">
            <img
                src={service.image}
                alt={service.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {service.name}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {service.description}
            </p>
            <div className="mt-4 text-blue-600 dark:text-blue-400 font-bold">
                ${Number(service.price).toFixed(2)}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => onEdit(service)}
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(service.id)}
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
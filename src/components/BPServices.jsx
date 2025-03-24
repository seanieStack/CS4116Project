"use client";

import { useState } from "react";

export default function BPServices() {
    const [services, setServices] = useState([
        {
            id: "1",
            name: "Database Migration",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere ante in vehicula convallis. Morbi.",
            price: 45.0,
            stock: 10,
            image: "https://picsum.photos/200/300",
        },
        {
            id: "2",
            name: "Cloud Optimisation",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere ante in vehicula convallis. Morbi.",
            price: 25.0,
            stock: 8,
            image: "https://picsum.photos/200/300",
        },
        {
            id: "3",
            name: "Security enhancement",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere ante in vehicula convallis. Morbi.",
            price: 70.0,
            stock: 4,
            image: "https://picsum.photos/200/300",
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedService = {
            id: editingServiceId || Date.now().toString(),
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image: formData.image || "https://via.placeholder.com/150",
        };

        if (editingServiceId) {
            setServices((prev) =>
                prev.map((service) =>
                    service.id === editingServiceId ? updatedService : service
                )
            );
        } else {
            setServices((prev) => [...prev, updatedService]);
        }

        // Reset
        setFormData({ name: "", description: "", price: "", stock: "", image: "" });
        setEditingServiceId(null);
        setShowForm(false);
    };

    const handleEdit = (service) => {
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            stock: service.stock,
            image: service.image,
        });
        setEditingServiceId(service.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setServices((prev) => prev.filter((service) => service.id !== id));
        setConfirmDeleteId(null);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingServiceId(null);
        setFormData({ name: "", description: "", price: "", stock: "", image: "" });
    };

    const serviceToDelete = services.find((s) => s.id === confirmDeleteId);

    return (
        <div className="flex flex-col w-full min-h-[calc(100vh-4em)] bg-gradient-to-b from-white to-blue-200 dark:from-blue-950 dark:to-background p-6">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        onClick={() => setShowForm(true)}
                        className="cursor-pointer flex flex-col items-center justify-center text-gray-600 dark:text-gray-400 rounded-xl p-4 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <div className="text-2xl">＋</div>
                        <div className="text-sm mt-1">Add New Service</div>
                    </div>

                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-4 transition"
                        >
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
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">
                                  ${service.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Stock: {service.stock}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setConfirmDeleteId(service.id)}
                                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                        <div className="relative bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md mx-auto shadow-xl">
                            <button
                                onClick={closeForm}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                {editingServiceId ? "Edit Service" : "Add New Service"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Service Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-800 dark:text-white"
                                    required
                                />
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-800 dark:text-white"
                                    rows="3"
                                />
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-800 dark:text-white"
                                    required
                                />
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="Stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-800 dark:text-white"
                                    required
                                />
                                <input
                                    type="text"
                                    name="image"
                                    placeholder="Image URL"
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded border bg-white dark:bg-neutral-800 dark:border-neutral-700 text-gray-800 dark:text-white"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {confirmDeleteId && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-sm shadow-xl relative">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Delete Service
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                                Are you sure you want to delete{" "}
                                <strong>{serviceToDelete?.name}</strong>? This action cannot be
                                undone.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmDeleteId)}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import BPServiceCard from "@/components/BPServiceCard";
import logger from "@/util/logger";

export default function BPServices({ user }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const DEFAULT_SERVICE_IMAGE = "https://dummyimage.com/400x400/0000ff/fff&text=Service";

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        businessId: "",
    });

    useEffect(() => {
        if (user?.id) {
            setFormData((prev) => ({
                ...prev,
                businessId: user.id,
            }));
        }
    }, [user]);

    useEffect(() => {
        async function loadServices() {
            try {
                const res = await fetch("/api/services");
                const data = await res.json();
                setServices(data);
            } catch (err) {
                logger.error("Failed to load services", err);
            } finally {
                setLoading(false);
            }
        }
        void loadServices();
    }, []);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleImageUpload = (imageUrl) => {
        setFormData((prev) => ({
            ...prev,
            image: imageUrl
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.businessId) return;

        try {
            const submissionData = { ...formData };

            if (!submissionData.image || submissionData.image.trim() === "") {
                submissionData.image = DEFAULT_SERVICE_IMAGE;
            }

            const url = editingServiceId
                ? `/api/services/${editingServiceId}`
                : `/api/services`;

            const method = editingServiceId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            const updatedService = await response.json();

            if (!updatedService.id) {
                logger.error("Invalid response:", updatedService);
                return;
            }

            if (editingServiceId) {
                setServices((prev) =>
                    prev.map((s) => (s.id === editingServiceId ? updatedService : s))
                );
            } else {
                setServices((prev) => [updatedService, ...prev]);
            }

            setFormData({
                name: "",
                description: "",
                price: "",
                image: "",
                businessId: user.id,
            });
            setEditingServiceId(null);
            setShowForm(false);
        } catch (err) {
            logger.error("Failed to submit service", err);
        }
    };

    const handleEdit = (service) => {
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            image: service.image,
            businessId: service.businessId,
        });
        setEditingServiceId(service.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!data.success) {
                console.error("Delete failed:", data.error);
                return;
            }

            setServices((prev) => prev.filter((service) => service.id !== id));
            setConfirmDeleteId(null);
        } catch (err) {
            console.error("Error deleting service:", err);
        }
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingServiceId(null);
        setFormData({ name: "", description: "", price: "", image: "", businessId: user.id });
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

                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
                    ) : (
                        services.length > 0 ? (
                            services.map((service) => (
                                <BPServiceCard
                                    key={service.id}
                                    service={service}
                                    onEdit={handleEdit}
                                    onDelete={setConfirmDeleteId}
                                />
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-400 col-span-full text-center">
                                No active services
                            </p>
                        )
                    )}
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

                                <div className="mb-4">
                                    <label className="block text-sm mb-1 text-gray-800 dark:text-white">
                                        Upload Image
                                    </label>
                                    <ImageUploader
                                        onUploadComplete={handleImageUpload}
                                        maxSizeMB={2}
                                        acceptedFileTypes="image/jpeg, image/png"
                                    />
                                    {formData.image ? (
                                        <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                                            Image uploaded successfully!
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                            No image uploaded. A default image will be used.
                                        </p>
                                    )}
                                </div>

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
                                <strong>{serviceToDelete?.name}</strong>? This action cannot be undone.
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
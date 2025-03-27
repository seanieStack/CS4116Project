'use client';

import { useState, useEffect } from 'react';
import logger from "@/util/logger";
import ImageUploader from "@/components/ImageUploader";

export default function TempServiceForm({ user }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        image: '',
        businessId: ''
    });


    useEffect(() => {
        if (user && user.id) {
            setFormData(prev => ({
                ...prev,
                businessId: user.id
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Service data to be submitted:', formData);

        if (!formData.name) {
            return;
        }

        if (!formData.businessId) {
            return;
        }

        try {
            console.log('Service data to be submitted:', formData);

            const response = await fetch('/api/services', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            });

            logger.log(response)

            setFormData({
                name: '',
                description: '',
                price: 0,
                image: '',
                businessId: formData.businessId
            });
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleImageUpload = (imageUrl) => {
        try {
            setFormData({
                ...formData,
                image: imageUrl
            });
        } catch (err) {
        }
    };

    return (
        <div className="max-w-md mt-8 mb-12 p-4 border">
            <h2 className="text-xl font-semibold mb-4">Temporary Service Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="block mb-1">Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border bg-white"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows="2"
                        className="w-full p-2 border bg-white"
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border bg-white"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Image</label>
                    <ImageUploader
                        onUploadComplete={handleImageUpload}
                        maxSizeMB={2}
                        acceptedFileTypes="image/jpeg, image/png, image/gif"
                    />
                    {formData.profileImage && (
                        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                            Image uploaded successfully!
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Create Service
                </button>
            </form>
        </div>
    );
}
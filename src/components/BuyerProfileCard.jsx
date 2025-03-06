"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

export default function ProfileForm({user}) {
    const [formData, setFormData] = useState({
        name: "",
        profileImage: ""
    });

    const handleImageUpload = (imageUrl) => {
        setFormData({
            ...formData,
            profileImage: imageUrl
        });
    };

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {

            console.log(formData);
            const response = await fetch("/api/updateBuyerProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user.id, ...formData }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg w-96 dark:bg-neutral-800 dark:text-white">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-white dark:bg-neutral-800">
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">Profile updated successfully!</p>}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Profile Image
                    </label>
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

                <div className="py-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600"
                    />
                </div>

                <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}
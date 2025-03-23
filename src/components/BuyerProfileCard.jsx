"use client";

import {useEffect, useState} from "react";
import ImageUploader from "@/components/ImageUploader";
import logger from "@/util/logger";

export default function BuyerProfileCard({user}) {
    const [formData, setFormData] = useState({
        name: "",
        profileImage: ""
    });

    useEffect(() => {
        if (!user) {
            logger.error("BuyerProfileCard: user prop is missing");
            setError("User information unavailable");
            return;
        }

        logger.log("BuyerProfileCard: User data loaded", {
            userId: user.id,
            hasName: !!user.name
        });
    }, [user]);

    const handleImageUpload = (imageUrl) => {
        try {
            logger.log("BuyerProfileCard: Image uploaded", { imageUrl: imageUrl.substring(0, 50) + '...' });
            setFormData({
                ...formData,
                profileImage: imageUrl
            });
        } catch (err) {
            logger.error("BuyerProfileCard: Error handling image upload", err);
            setError("Failed to process uploaded image");
        }
    };

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        if (!user || !user.id) {
            logger.error("BuyerProfileCard: Missing user ID for profile update");
            setError("Cannot update profile: User ID is missing");
            setLoading(false);
            return;
        }

        try {
            logger.log("BuyerProfileCard: Submitting form data", {
                userId: user.id,
                nameLength: formData.name.length,
                hasImage: !!formData.profileImage
            });

            const response = await fetch("/api/profile/updateBuyerProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user.id, ...formData }),
            });

            if (!response) {
                throw new Error("Network error: No response received");
            }

            const data = await response.json().catch(err => {
                logger.error("BuyerProfileCard: Failed to parse response JSON", err);
                throw new Error("Failed to parse server response");
            });

            if (!response.ok) {
                logger.error("BuyerProfileCard: API error response", {
                    status: response.status,
                    statusText: response.statusText,
                    error: data?.message || "Unknown error"
                });
                throw new Error(data.message || `Failed to update profile (${response.status})`);
            }

            logger.log("BuyerProfileCard: Profile updated successfully", { responseData: data });
            setSuccess(true);
        } catch (err) {
            logger.error("BuyerProfileCard: Error updating profile", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (fieldName, value) => {
        try {
            if (fieldName === "name" && value.length > 50) {
                logger.warn("BuyerProfileCard: Name exceeds recommended length", { length: value.length });
                setError("Name should be less than 50 characters");
            } else if (error && error.includes("Name")) {
                setError("");
            }

            setFormData({...formData, [fieldName]: value});
        } catch (err) {
            logger.error("BuyerProfileCard: Error handling field change", { fieldName, error: err });
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
                        placeholder={user.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
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
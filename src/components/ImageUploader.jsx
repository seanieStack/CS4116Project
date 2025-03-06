"use client";

import { useState, useRef } from "react";
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ImageUploader({ onUploadComplete, maxSizeMB = 5, acceptedFileTypes = "image/*" }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError(null);

        if (!selectedFile) return;

        if (selectedFile.size > maxSizeBytes) {
            setError(`File size exceeds the ${maxSizeMB}MB limit`);
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setError(null);

        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile) return;

        if (droppedFile.size > maxSizeBytes) {
            setError(`File size exceeds the ${maxSizeMB}MB limit`);
            return;
        }

        setFile(droppedFile);

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Upload failed");
            }

            const data = await response.json();

            onUploadComplete(data.url);

            setFile(null);
            setPreview(null);
        } catch (err) {
            setError(err.message || "Something went wrong during upload");
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={acceptedFileTypes}
                className="hidden"
            />

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    file ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
                } ${error ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""}`}>

                {!preview ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Drag and drop an image here, or click to select
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Max size: {maxSizeMB}MB
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-md object-contain"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFile();
                            }}
                            className="absolute top-1 right-1 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-full p-1"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-2 text-red-500 text-sm">{error}</div>
                )}
            </div>

            {file && (
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            <span>Upload</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
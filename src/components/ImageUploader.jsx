"use client";

import {useState, useRef, useEffect} from "react";
import { ArrowUpTrayIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import logger from "@/util/logger";

export default function ImageUploader({ onUploadComplete, maxSizeMB = 5, acceptedFileTypes = "image/*" }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    useEffect(() => {
        if (!onUploadComplete || typeof onUploadComplete !== 'function') {
            logger.error("ImageUploader: onUploadComplete prop is missing or not a function");
        }

        logger.log("ImageUploader: Component initialized", {
            maxSizeMB,
            acceptedFileTypes,
            maxSizeBytes
        });
    }, [onUploadComplete, maxSizeMB, acceptedFileTypes, maxSizeBytes]);

    const validateFile = (selectedFile) => {
        try {
            if (!selectedFile) {
                logger.warn("ImageUploader: No file selected");
                return false;
            }

            if (selectedFile.size > maxSizeBytes) {
                const fileSizeMB = (selectedFile.size / (1024 * 1024));
                logger.error(`ImageUploader: File size exceeds limit`, {
                    fileName: selectedFile.name,
                    fileSize: fileSizeMB + "MB",
                    maxAllowed: maxSizeMB + "MB"
                });
                setError(`File size (${fileSizeMB}MB) exceeds the ${maxSizeMB}MB limit`);
                return false;
            }

            logger.log("ImageUploader: File validated successfully", {
                fileName: selectedFile.name,
                fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + "MB",
                fileType: selectedFile.type
            });

            return true;
        } catch (err) {
            logger.error("ImageUploader: Error validating file", err);
            setError("Error validating file");
            return false;
        }
    };

    const createPreview = (selectedFile) => {
        try {
            const reader = new FileReader();

            reader.onload = () => {
                setPreview(reader.result);
                logger.log("ImageUploader: Preview generated");
            };

            reader.onerror = (error) => {
                logger.error("ImageUploader: Error generating preview", error);
                setError("Failed to generate image preview");
            };

            reader.readAsDataURL(selectedFile);
        } catch (err) {
            logger.error("ImageUploader: Error creating preview", err);
            setError("Failed to process image");
        }
    };

    const handleFileChange = (e) => {
        try {
            setError(null);
            const selectedFile = e.target.files[0];

            if (!selectedFile) {
                logger.log("ImageUploader: File selection canceled");
                return;
            }

            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                createPreview(selectedFile);
            }
        } catch (err) {
            logger.error("ImageUploader: Error handling file change", err);
            setError("Error selecting file");
        }
    };

    const handleDrop = (e) => {
        try {
            e.preventDefault();
            setError(null);

            if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
                logger.warn("ImageUploader: No files dropped");
                return;
            }

            const droppedFile = e.dataTransfer.files[0];

            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                createPreview(droppedFile);
            }
        } catch (err) {
            logger.error("ImageUploader: Error handling file drop", err);
            setError("Error processing dropped file");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            logger.warn("ImageUploader: Attempted upload with no file");
            return;
        }

        try {
            setUploading(true);
            setError(null);

            logger.log("ImageUploader: Starting upload", {
                fileName: file.name,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + "MB"
            });

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response) {
                throw new Error("Network error: No response received");
            }

            if (!response.ok) {
                const errorData = await response.json().catch(err => {
                    logger.error("ImageUploader: Failed to parse error response", err);
                    return { message: `Upload failed with status: ${response.status}` };
                });

                logger.error("ImageUploader: Upload failed", {
                    status: response.status,
                    statusText: response.statusText,
                    errorMessage: errorData.message || "Unknown error"
                });

                throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
            }

            const data = await response.json().catch(err => {
                logger.error("ImageUploader: Failed to parse success response", err);
                throw new Error("Failed to parse server response");
            });

            if (!data || !data.url) {
                logger.error("ImageUploader: Missing URL in response", data);
                throw new Error("Server response missing image URL");
            }

            logger.log("ImageUploader: Upload successful", {
                imageUrl: data.url.substring(0, 50) + '...'
            });

            onUploadComplete(data.url);

            setFile(null);
            setPreview(null);
        } catch (err) {
            const errorMessage = err.message || "Something went wrong during upload";
            logger.error("ImageUploader: Upload error", err);
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        try {
            setFile(null);
            setPreview(null);
            setError(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            logger.log("ImageUploader: File selection cleared");
        } catch (err) {
            logger.error("ImageUploader: Error clearing file", err);
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
                            onError={() => {
                                logger.error("ImageUploader: Error loading preview image");
                                setError("Failed to display image preview");
                            }}
                        />
                        <button
                            type="button"
                            onClick={clearFile}
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
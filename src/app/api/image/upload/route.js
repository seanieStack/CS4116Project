import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3Upload";
import logger from "@/util/logger";

export async function POST(request) {

    logger.log("File upload request received");

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            logger.warn("Upload rejected: No file provided in request");
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        logger.log(`Processing upload: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            logger.warn(`Upload rejected: File size ${file.size} exceeds limit of ${MAX_FILE_SIZE} bytes`);
            return NextResponse.json(
                { error: "File too large (max 10MB)" },
                { status: 400 }
            );
        }

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "text/plain"];
        if (!allowedTypes.includes(file.type)) {
            logger.warn(`Upload rejected: File type ${file.type} not allowed`);
            return NextResponse.json(
                { error: "File type not allowed" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name;
        const contentType = file.type;

        logger.log("Sending file to S3...");
        const url = await uploadToS3(buffer, fileName, contentType, "uploads");

        return NextResponse.json({
            success: true,
            url,
            fileName,
            contentType,
            size: file.size
        });
    } catch (error) {
        if (error.message === "File buffer is required" ||
            error.message === "File name is required" ||
            error.message === "S3 configuration missing") {

            logger.error(`Upload configuration error: ${error.message}`);
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        logger.error("Upload failed with error:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        return NextResponse.json(
            {
                error: "File upload failed",
                code: "UPLOAD_ERROR"
            },
            { status: 500 }
        );
    }
}
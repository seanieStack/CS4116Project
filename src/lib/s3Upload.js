"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3";
import crypto from "crypto";

const generateUniqueFileName = (originalFileName) => {
    try {
        const fileExtension = originalFileName.split('.').pop();
        const randomString = crypto.randomBytes(16).toString('hex');
        return `${randomString}.${fileExtension}`;
    } catch (error) {
        console.error(`Error generating unique filename: ${error.message}`);
        const timestamp = Date.now();
        const fileExtension = originalFileName?.split('.')?.pop() || 'bin';
        return `${timestamp}.${fileExtension}`;
    }
};

export async function uploadToS3(fileBuffer, fileName, contentType, directory = "") {
    if (!fileBuffer) {
        console.error("File upload failed: File buffer is required");
        throw new Error("File buffer is required");
    }

    if (!fileName) {
        console.error("File upload failed: File name is required");
        throw new Error("File name is required");
    }

    console.log(`Starting S3 upload for file: ${fileName}, type: ${contentType}, directory: ${directory || 'root'}`);


    try {

        if (!process.env.ENV_AWS_S3_BUCKET_NAME || !process.env.ENV_AWS_REGION) {
            console.error("S3 upload failed: Required environment variables are not set");
            throw new Error("S3 configuration missing");
        }

        const uniqueFileName = generateUniqueFileName(fileName);
        const key = directory ? `${directory}/${uniqueFileName}` : uniqueFileName;

        const params = {
            Bucket: process.env.ENV_AWS_S3_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        };

        console.log(`Uploading to bucket: ${params.Bucket}, key: ${params.Key}`);

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.ENV_AWS_S3_BUCKET_NAME}.s3.${process.env.ENV_AWS_REGION}.amazonaws.com/${key}`;
        console.log(`File successfully uploaded: ${fileUrl}`);

        return fileUrl;
    } catch (error) {

        const errorMessage =
            `S3 upload failed: ${error.message} | ` +
            `File: ${fileName} | ` +
            `Size: ${fileBuffer?.length || 'unknown'} bytes | ` +
            `Directory: ${directory || 'root'}`;

        console.error(errorMessage);

        if (error.$metadata) {
            console.error(`S3 Error Details: ${JSON.stringify(error.$metadata)}`);
        }

        throw new Error("Failed to upload file to S3");
    }
}
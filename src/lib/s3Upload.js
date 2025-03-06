"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3";
import crypto from "crypto";

const generateUniqueFileName = (originalFileName) => {
    const fileExtension = originalFileName.split('.').pop();
    const randomString = crypto.randomBytes(16).toString('hex');
    return `${randomString}.${fileExtension}`;
};

export async function uploadToS3(fileBuffer, fileName, contentType, directory = "") {
    try {
        const uniqueFileName = generateUniqueFileName(fileName);
        const key = directory ? `${directory}/${uniqueFileName}` : uniqueFileName;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {

        console.error(error);

        console.error("Error uploading to S3:", error);
        throw new Error("Failed to upload file");
    }
}
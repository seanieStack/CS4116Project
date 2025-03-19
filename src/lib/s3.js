import {S3Client} from "@aws-sdk/client-s3";

const requiredEnvVars = [
    'ENV_AWS_REGION',
    'ENV_AWS_ACCESS_KEY_ID',
    'ENV_AWS_SECRET_ACCESS_KEY'
];

let missingVars = [];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]){
        console.error(`Missing required environment variable: ${envVar}`);
        missingVars.push(envVar);
    }
}

if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

let s3Client;
try {
    s3Client = new S3Client({
        region: process.env.ENV_AWS_REGION,
        credentials: {
            accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY,
        },
    });

    console.log(`S3 client initialized`);
} catch (error) {
    console.error(`Failed to initialize S3 client: ${error.message}`);
    throw error;
}

export { s3Client };
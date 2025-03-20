/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        ENV_AWS_ACCESS_KEY_ID: process.env.ENV_AWS_ACCESS_KEY_ID,
        ENV_AWS_SECRET_ACCESS_KEY: process.env.ENV_AWS_SECRET_ACCESS_KEY,
        ENV_AWS_S3_BUCKET_NAME: process.env.ENV_AWS_S3_BUCKET_NAME,
        ENV_AWS_REGION: process.env.ENV_AWS_REGION,
        IS_PROD: process.env.IS_PROD || 'true'
    }
};

export default nextConfig;

"use server"

import {prisma} from "@/lib/prisma";
import {generateSalt, hashPassword, comparePassword} from "@/auth/core/password";
import {createUserSession, removeUserSession} from "@/auth/core/session";
import {cookies} from "next/headers";
import logger from "@/util/logger";

/**
 * Creates a new user account and starts an authentication session
 *
 * Validates registration data, checks for existing accounts with the same email,
 * hashes the password, creates the appropriate user record based on role,
 * and starts an authentication session for the new user.
 *
 * @async
 * @function signUp
 * @param {Object} data - The user registration data
 * @param {string} data.email - User's email address (required)
 * @param {string} data.password - User's chosen password (required)
 * @param {string} data.confirmPassword - Password confirmation (required, must match password)
 * @param {string} data.role - User role, must be either "BUYER" or "BUSINESS" (required)
 *
 * @returns {Promise<{success: boolean, error?: string, redirectPath?: string}>} Result object with success status and optional error message
 */
export async function signUp(data) {
    if (!data || !data.email || !data.password || !data.confirmPassword || !data.role) {
        logger.error("Sign up failed: Missing required fields");
        return { success: false, error: "All fields are required" };
    }

    if (data.password !== data.confirmPassword) {
        logger.warn(`Sign up failed: Password mismatch for ${data.email}`);
        return { success: false, error: "Passwords do not match" };
    }

    if (data.role !== "BUYER" && data.role !== "BUSINESS") {
        logger.error(`Sign up failed: Invalid role ${data.role}`);
        return { success: false, error: "Invalid role. Must be BUYER or BUSINESS" };
    }

    try {
        const existingUser = await prisma.buyer.findFirst({
            where: { email: data.email }
        });

        const existingBusiness = await prisma.business.findFirst({
            where: { email: data.email }
        });

        if (existingUser || existingBusiness) {
            logger.warn(`Sign up failed: Account already exists for ${data.email}`);
            return { success: false, error: "Email address is already in use" };
        }
    } catch (lookupError) {
        logger.error(`Error checking for existing accounts: ${lookupError.message}`);
        return { success: false, error: "Error checking for existing accounts. Please try again" };
    }

    let salt, hashedPassword;
    try {
        salt = generateSalt();
        hashedPassword = await hashPassword(data.password, salt);
    } catch (passwordError) {
        logger.error(`Error hashing password: ${passwordError.message}`);
        return { success: false, error: "Error processing password. Please try again" };
    }

    let user;
    try {
        if (data.role === "BUYER") {
            user = await prisma.buyer.create({
                data: {
                    name: data.email,
                    email: data.email,
                    password: hashedPassword,
                    salt: salt,
                }
            });
            logger.log(`New buyer account created: ${data.email}`);
        } else if (data.role === "BUSINESS") {
            user = await prisma.business.create({
                data: {
                    name: data.email,
                    email: data.email,
                    password: hashedPassword,
                    salt: salt,
                }
            });
            logger.log(`New business account created: ${data.email}`);
        }

        if (!user) {
            throw new Error("Failed to create account");
        }
    } catch (createError) {
        logger.error(`Error creating account: ${createError.message}`);
        return { success: false, error: "Account creation failed. Please try again" };
    }

    try {
        await createUserSession(user, data.role);
        logger.log(`Session created for new user: ${data.email}`);
    } catch (sessionError) {
        logger.error(`Error creating session: ${sessionError.message}`);
        return { success: false, error: "Account created but sign-in failed. Please sign in manually" };
    }

    return { success: true, redirectPath: "/profile" };
}

/**
 * Authenticates a user and creates an authentication session.
 *
 * Validates the provided credentials, looks up the user account across
 * multiple account types (buyer, business, or admin), verifies the password,
 * and creates an authentication session for the user.
 *
 * @async
 * @function signIn
 * @param {Object} data - The sign-in data
 * @param {string} data.email - User's email address (required)
 * @param {string} data.password - User's password (required)
 *
 * @returns {Promise<{success: boolean, error?: string, redirectPath?: string}>} Result object with success status and optional error message
 */
export async function signIn(data) {
    if (!data || !data.email || !data.password) {
        logger.error("Sign in failed: Missing required fields");
        return { success: false, error: "Email and password are required" };
    }

    let user = null;
    let business = null;
    let admin = null;
    let accountType = null;

    try {
        user = await prisma.buyer.findUnique({
            where: { email: data.email }
        });

        if (user) {
            accountType = "BUYER";
        } else {
            business = await prisma.business.findUnique({
                where: { email: data.email }
            });

            if (business) {
                accountType = "BUSINESS";
            } else {
                admin = await prisma.admin.findUnique({
                    where: { email: data.email }
                });

                if (admin) {
                    accountType = "ADMIN";
                }
            }
        }

        if (!user && !business && !admin) {
            logger.warn(`Sign in failed: No account found for ${data.email}`);
            return { success: false, error: "No account found with this email address" };
        }
    } catch (lookupError) {
        logger.error(`Error looking up account: ${lookupError.message}`);
        return { success: false, error: "Error retrieving account information. Please try again" };
    }

    try {
        const account = user || business || admin;
        if (!await comparePassword(account.password, data.password, account.salt)) {
            logger.warn(`Sign in failed: Incorrect password for ${data.email}`);
            return { success: false, error: "Incorrect password" };
        }
    } catch (passwordError) {
        logger.error(`Error verifying password: ${passwordError.message}`);
        return { success: false, error: "Error verifying credentials. Please try again" };
    }

    try {
        await createUserSession(user || business || admin, accountType);
        logger.log(`User signed in successfully: ${data.email} as ${accountType}`);
    } catch (sessionError) {
        logger.error(`Error creating session: ${sessionError.message}`);
        return { success: false, error: "Authentication succeeded but session creation failed. Please try again" };
    }

    let redirectPath = "/";

    if (accountType === "ADMIN") {
        redirectPath = "/admin";
    }
    else if (accountType === "BUSINESS") {
        redirectPath = "/businesspanel";
    }

    return { success: true, redirectPath };
}

/**
 * Signs out the current user by removing their session.
 *
 * Attempts to remove the user's session cookie.
 *
 * @async
 * @function signOut
 * @returns {Promise<{success: boolean, error?: string, redirectPath?: string}>} Result object with success status
 */
export async function signOut() {
    try {
        await removeUserSession(await cookies());
        logger.log("User signed out successfully");
        return { success: true, redirectPath: "/" };
    } catch (error) {
        logger.error(`Error during sign out: ${error.message}`);
        return { success: false, error: "Error during sign out", redirectPath: "/" };
    }
}
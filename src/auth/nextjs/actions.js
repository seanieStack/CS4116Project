"use server"

import {prisma} from "@/lib/prisma";
import {generateSalt, hashPassword, comparePassword} from "@/auth/core/password";
import {createUserSession, removeUserSession} from "@/auth/core/session";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

export async function signUp(data) {
    if (!data || !data.email || !data.password || !data.confirmPassword || !data.role) {
        console.error("Sign up failed: Missing required fields");
        return "All fields are required";
    }

    if (data.password !== data.confirmPassword) {
        console.warn(`Sign up failed: Password mismatch for ${data.email}`);
        return "Passwords do not match";
    }

    if (data.role !== "BUYER" && data.role !== "BUSINESS") {
        console.error(`Sign up failed: Invalid role ${data.role}`);
        return "Invalid role. Must be BUYER or BUSINESS";
    }

    try {
        const existingUser = await prisma.buyer.findFirst({
            where: { email: data.email }
        });

        const existingBusiness = await prisma.business.findFirst({
            where: { email: data.email }
        });

        if (existingUser || existingBusiness) {
            console.warn(`Sign up failed: Account already exists for ${data.email}`);
            return "Email address is already in use";
        }
    } catch (lookupError) {
        console.error(`Error checking for existing accounts: ${lookupError.message}`);
        return "Error checking for existing accounts. Please try again";
    }

    let salt, hashedPassword;
    try {
        salt = generateSalt();
        hashedPassword = await hashPassword(data.password, salt);
    } catch (passwordError) {
        console.error(`Error hashing password: ${passwordError.message}`);
        return "Error processing password. Please try again";
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
            console.log(`New buyer account created: ${data.email}`);
        } else if (data.role === "BUSINESS") {
            user = await prisma.business.create({
                data: {
                    name: data.email,
                    email: data.email,
                    password: hashedPassword,
                    salt: salt,
                }
            });
            console.log(`New business account created: ${data.email}`);
        }

        if (!user) {
            throw new Error("Failed to create account");
        }
    } catch (createError) {
        console.error(`Error creating account: ${createError.message}`);
        return "Account creation failed. Please try again";
    }

    try {
        await createUserSession(user, data.role);
        console.log(`Session created for new user: ${data.email}`);
    } catch (sessionError) {
        console.error(`Error creating session: ${sessionError.message}`);
        return "Account created but sign-in failed. Please sign in manually";
    }

    redirect("/profile");
}

export async function signIn(data) {
    if (!data || !data.email || !data.password) {
        console.error("Sign in failed: Missing required fields");
        return "Email and password are required";
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
            console.warn(`Sign in failed: No account found for ${data.email}`);
            return "No account found with this email address";
        }
    } catch (lookupError) {
        console.error(`Error looking up account: ${lookupError.message}`);
        return "Error retrieving account information. Please try again";
    }

    try {
        const account = user || business || admin;
        if (!await comparePassword(account.password, data.password, account.salt)) {
            console.warn(`Sign in failed: Incorrect password for ${data.email}`);
            return "Incorrect password";
        }
    } catch (passwordError) {
        console.error(`Error verifying password: ${passwordError.message}`);
        return "Error verifying credentials. Please try again";
    }

    try {
        await createUserSession(user || business || admin, accountType);
        console.log(`User signed in successfully: ${data.email} as ${accountType}`);
    } catch (sessionError) {
        console.error(`Error creating session: ${sessionError.message}`);
        return "Authentication succeeded but session creation failed. Please try again";
    }

    if (accountType === "ADMIN") {
        redirect("/");
        //TODO: replace with admin panel when implemented
    } else {
        redirect("/");
    }
}

export async function signOut() {
    try {
        await removeUserSession(await cookies());
        console.log("User signed out successfully");
    } catch (error) {
        console.error(`Error during sign out: ${error.message}`);
    }

    redirect("/");
}
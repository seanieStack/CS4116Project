"use server"

import {prisma} from "@/lib/prisma";
import {generateSalt, hashPassword, comparePassword} from "@/auth/core/password";
import {createUserSession} from "@/auth/core/session";
import {redirect} from "next/navigation";

export async function signUp(data){

    const existingUser = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })

    if(data.password !== data.confirmPassword) return "Passwords do not match";
    if (existingUser) return "User already exists";

    try {
        const salt = generateSalt();
        const hashedPassword = await hashPassword(data.password, salt);

        const user = await prisma.user.create({
            data: {
                name: data.email,
                email: data.email,
                password: hashedPassword,
                salt: salt,
                banned: false,
            }
        })
        if (user === null) return "Unable to create user";

        await createUserSession(user);

    } catch {
        return "Error occurred while creating user";
    }

    redirect("/")
}

export async function signIn(data) {

    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })

    if (user === null) return "Unable to find user with that email";

    if (!await comparePassword(user.password, data.password, user.salt)) return "Incorrect password";

    await createUserSession(user);

    redirect("/")
}


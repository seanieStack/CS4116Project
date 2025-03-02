"use server"

import {prisma} from "@/lib/prisma";
import {generateSalt, hashPassword} from "@/auth/core/password";
import {createUserSession} from "@/auth/core/Session";

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
        if (user === null) return "Unable to create user 2";

        await createUserSession(user);

    } catch {
        return "Unable to create user 1";
    }

    // redirect("/landing")
}
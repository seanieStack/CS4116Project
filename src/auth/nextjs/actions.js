"use server"

import {prisma} from "@/lib/prisma";
import {generateSalt, hashPassword, comparePassword} from "@/auth/core/password";
import {createUserSession, removeUserSession} from "@/auth/core/session";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

export async function signUp(data){

    if(data.password !== data.confirmPassword) return "Passwords do not match";

    const existingUser = await prisma.buyer.findFirst({
        where: {
            email: data.email
        }
    })

    const existingBusiness = await prisma.business.findFirst({
        where: {
            email: data.email
        }
    })


    if (existingUser || existingBusiness) return "User or business already exists";

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const user = await prisma.buyer.create({
        data: {
            name: data.email,
            email: data.email,
            password: hashedPassword,
            salt: salt,
            banned: false,
        }
    })
    if (user === null) return "Unable to create user";

    await createUserSession(user, data.role);

    redirect("/")
}

export async function signIn(data) {

    const user = await prisma.buyer.findUnique({
        where: {
            email: data.email
        }
    })

    const business = await prisma.business.findUnique({
        where: {
            email: data.email
        }
    });


    if (user === null && business) return "Unable to find user with that email";

    if (!await comparePassword(user.password, data.password, user.salt)) return "Incorrect password";

    await createUserSession(user);

    redirect("/")
}

export async function signOut() {
    await removeUserSession(await cookies())
    redirect("/")
}


import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";

export async function getBusinessName() {
    const session = await getCurrentSessionInfo();
    const user = await getCurrentUser();

    if (!session || session.role !== "BUSINESS") return 0;

    return user.name;
}
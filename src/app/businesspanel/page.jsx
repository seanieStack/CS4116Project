import Navbar from "@/components/Navbar";
import {getCurrentUser} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import BPNav from "@/components/BPNav";
import BPOverview from "@/components/BPOverview";

export default async function businesspanel() {
    const user = await getCurrentUser();
    /*if (user === null || user.role !== "BUSINESS") {
        redirect("/")
    } */
    return (
        <>
            <Navbar/>
            <BPNav/>
            <BPOverview/>
        </>
    )
}

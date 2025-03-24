import Navbar from "@/components/Navbar";
import {getCurrentUser} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import BPNav from "@/components/BPNav";
import BPServices from "@/components/BPServices";

export default async function services() {
    const user = await getCurrentUser();
    /*if (user === null || user.role !== "BUSINESS") {
        redirect("/")
    } */
    return (
        <>
            <Navbar/>
            <BPNav/>
            <BPServices/>
        </>
    )
}
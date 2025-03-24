import Navbar from "@/components/Navbar";
import BPNav from "@/components/BPNav";
import BPMessages from "@/components/BPMessages";
import {getCurrentUser} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";

export default async function messages() {
    const user = await getCurrentUser();
    /*if (user === null || user.role !== "BUSINESS") {
        redirect("/")
    } */
    return (
        <>
            <Navbar/>
            <BPNav/>
            <BPMessages/>
        </>
    )
}

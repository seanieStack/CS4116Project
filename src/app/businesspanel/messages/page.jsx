import Navbar from "@/components/Navbar";
import BPNav from "@/components/BPNav";
import BPMessages from "@/components/BPMessages";
import {getCurrentSessionInfo} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import Footer from "@/components/Footer";

export default async function messages() {
    const session = await getCurrentSessionInfo();
    if (session?.role !== "BUSINESS") {
        redirect("/")
    }
    return (
        <>
            <Navbar/>
            <BPNav/>
            <BPMessages/>
            <Footer/>
        </>
    )
}

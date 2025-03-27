import Navbar from "@/components/Navbar";
import {getCurrentSessionInfo} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import BPNav from "@/components/BPNav";
import BPOverview from "@/components/BPOverview";
import Footer from "@/components/Footer";

export default async function businesspanel() {
    const session = await getCurrentSessionInfo();
    if (session?.role !== "BUSINESS") {
        redirect("/")
    }

    return (
        <>
            <Navbar/>
            <BPNav/>
            <BPOverview/>
            <Footer/>
        </>
    )
}

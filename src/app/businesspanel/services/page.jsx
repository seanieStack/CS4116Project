import Navbar from "@/components/Navbar";
import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import BPNav from "@/components/BPNav";
import BPServices from "@/components/BPServices";
import logger from "@/util/logger";
import Footer from "@/components/Footer";

export default async function services() {
    const user = await getCurrentUser();
    logger.log("User:", user);
    const session = await getCurrentSessionInfo();
    if (session?.role !== "BUSINESS") {
        redirect("/")
    }
    return (
        <>
            <Navbar/>
            <BPNav/>
            <BPServices user={user}/>
            <Footer/>
        </>
    )
}
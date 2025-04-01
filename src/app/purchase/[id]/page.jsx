import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import {getServiceById} from "@/db/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PurchasePanel from "@/components/PurchasePanel";

export default async function Purchase({params}) {
    const id = (await params).id;

    const service = await getServiceById(id);

    const sessionInfo = await getCurrentSessionInfo();
    const user = await getCurrentUser();

    if (sessionInfo.role !== "BUYER"){
        //TODO: display errir saying only buyers can buy products
        redirect("/");
    }

    return (
        <>
            <Navbar/>
            <PurchasePanel user={user} service={service}/>
            <Footer />
        </>
    );
}
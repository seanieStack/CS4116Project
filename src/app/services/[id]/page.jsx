import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceViewer from "@/components/ServiceViewer";
import { getServiceById } from "@/db/services";

export default async function ServicePage({ params }) {
    const id = (await params).id;
    const service = await getServiceById(id);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <ServiceViewer service={service} />
            <Footer className="mt-auto" />
        </div>
    );
}
import TempServiceForm from '@/components/TempServiceForm';
import {getCurrentSessionInfo, getCurrentUser} from "@/auth/nextjs/currentUser";
import {redirect} from "next/navigation";
import logger from "@/util/logger";

export default async function TempServicePage() {

    const user = await getCurrentUser();
    const session = await getCurrentSessionInfo();

    if (session?.role !== 'BUSINESS') {
        redirect("/");
    }

    return (
        <div className="text-black h-screen w-screen">
            <h1>Temporary Service Form</h1>
            <p>
                This is a temporary form until the business panel is completed.
            </p>
            <TempServiceForm user={user}/>
        </div>
    );
}
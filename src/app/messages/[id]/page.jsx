import ConversationPage from "@/components/ConversationPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function MessagesConversationPage({params}) {
    return (
        <>
            <Navbar/>
            <ConversationPage params={await params}/>
            <Footer/>
        </>
    );
}
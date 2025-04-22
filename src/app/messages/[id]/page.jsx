import ConversationPage from "@/components/ConversationPage";

export default async function MessagesConversationPage({params}) {
    return <ConversationPage params={await params}/>;
}
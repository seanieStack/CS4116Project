import { useEffect, useState } from 'react';

export default function MessagesList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function fetchMessages() {
            const response = await fetch('/api/messages');
            const data = await response.json();
            setMessages(data.messages);
        }
        fetchMessages();
    }, []);

    return (
        <table className="min-w-full bg-white">
            <thead>
            <tr>
                <th className="py-2">Sender</th>
                <th className="py-2">Message</th>
                <th className="py-2">Date</th>
            </tr>
            </thead>
            <tbody>
            {messages.map((message) => (
                <tr key={message.id}>
                    <td className="py-2">{message.sender}</td>
                    <td className="py-2">{message.message}</td>
                    <td className="py-2">{new Date(message.date).toLocaleDateString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
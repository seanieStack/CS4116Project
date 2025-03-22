
import { useEffect, useState } from 'react';

export default function MessagesList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch('/api/messages')
            .then(response => response.json())
            .then(data => setMessages(data));
    }, []);

    return (
        <div className="bg-white dark:bg-neutral-800">
            <table>
                <thead>
                <tr>
                    <th className="text-black dark:text-white">ID</th>
                    <th className="text-black dark:text-white">Message</th>
                </tr>
                </thead>
                <tbody>
                {messages.map(message => (
                    <tr key={message.id}>
                        <td className="text-black dark:text-white">{message.id}</td>
                        <td className="text-black dark:text-white">{message.message}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
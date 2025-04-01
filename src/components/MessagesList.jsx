export default function MessagesList({messages}) {
    return (
        <table className="min-w-full bg-white text-black">
            <thead>
            <tr>
                <th className="py-2">Sender</th>
                <th className="py-2">Message</th>
                <th className="py-2">Date</th>
            </tr>
            </thead>
            <tbody>
            {messages.map((message) => (
                <tr key={message.id} className="py-2 border border-gray-200">
                    <td className="py-2">{message.sender}</td>
                    <td className="py-2">{message.message}</td>
                    <td className="py-2">{new Date(message.date).toLocaleDateString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
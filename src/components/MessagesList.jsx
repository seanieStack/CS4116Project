export default function MessagesList({ messages }) {
    return (
        <div className="overflow-x-auto p-4">
            <div className="bg-gray-700 shadow-lg rounded-lg p-4">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-600">
                        <tr>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Sender
                            </th>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Message
                            </th>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-700 divide-y divide-gray-600">
                        {messages.map((message) => (
                            <tr key={message.id}>
                                <td className="px-6 py-4">{message.sender}</td>
                                <td className="px-6 py-4">{message.message}</td>
                                <td className="px-6 py-4">{new Date(message.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

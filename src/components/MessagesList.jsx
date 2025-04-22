export default function MessagesList({ messages }) {
    return (
        <div className="overflow-x-auto p-4">
            <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                        <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                            Sender
                        </th>
                        <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                            Message
                        </th>
                        <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                            Date
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {/*{messages.map((message) => (*/}
                    {/*    <tr key={message.id} className="hover:bg-gray-50 dark:hover:bg-gray-650">*/}
                    {/*        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{message.sender}</td>*/}
                    {/*        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{message.message}</td>*/}
                    {/*        <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{new Date(message.date).toLocaleDateString()}</td>*/}
                    {/*    </tr>*/}
                    {/*))}*/}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
'use client';
import BanUser from "@/components/BanUser";
export default function UsersList({ buyers }) {
    return (
        <div className="overflow-x-auto p-4">
            <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                                Buyer ID
                            </th>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                                Name
                            </th>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                                Email
                            </th>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                                Banned
                            </th>
                            <th className="text-left px-6 py-3 text-gray-700 dark:text-white font-semibold uppercase text-sm tracking-wider">
                                Profile Image
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                        {buyers.map((buyer) => (
                            <tr key={buyer.id}>
                                <td className="px-6 py-4">{buyer.id}</td>
                                <td className="px-6 py-4">{buyer.name}</td>
                                <td className="px-6 py-4">{buyer.email}</td>
                                <td className="px-6 py-4"><BanUser buyer={buyer} /></td>
                                <td className="px-6 py-4">
                                    {buyer.profile_img ? (
                                        <img
                                            src={buyer.profile_img}
                                            alt="Profile"
                                            className="h-10 w-10 rounded-full"
                                        />
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

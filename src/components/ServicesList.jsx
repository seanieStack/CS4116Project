export default function ServicesList({ services }) {
    return (
        <div className="overflow-x-auto p-4">
            <div className="bg-gray-700 shadow-lg rounded-lg p-4">
                <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-600">
                        <tr>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Service ID
                            </th>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Service Name
                            </th>
                            <th className="text-left px-6 py-3 text-white font-semibold uppercase text-sm tracking-wider">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-700 divide-y divide-gray-600">
                        {services.map((service) => (
                            <tr key={service.id}>
                                <td className="px-6 py-4">{service.id}</td>
                                <td className="px-6 py-4">{service.name}</td>
                                <td className="px-6 py-4">{service.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

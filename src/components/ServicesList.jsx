export default function ServicesList({services}) {
    return (
        <table className="min-w-full bg-white text-black">
            <thead>
            <tr>
                <th className="py-2">Service ID</th>
                <th className="py-2">Service Name</th>
                <th className="py-2">Description</th>
            </tr>
            </thead>
            <tbody>
            {services.map((service) => (
                <tr key={service.id} className="py-2 border border-gray-200">
                    <td className="py-2">{service.id}</td>
                    <td className="py-2">{service.name}</td>
                    <td className="py-2">{service.description}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
import { useEffect, useState } from 'react';

export default function ServicesList() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        async function fetchServices() {
            const response = await fetch('/api/services');
            const data = await response.json();
            setServices(data.services);
        }
        fetchServices();
    }, []);

    return (
        <table className="min-w-full bg-white">
            <thead>
            <tr>
                <th className="py-2">Service ID</th>
                <th className="py-2">Service Name</th>
                <th className="py-2">Description</th>
            </tr>
            </thead>
            <tbody>
            {services.map((service) => (
                <tr key={service.id}>
                    <td className="py-2">{service.id}</td>
                    <td className="py-2">{service.name}</td>
                    <td className="py-2">{service.description}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
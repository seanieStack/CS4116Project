"use client"
import { useEffect, useState } from 'react';

export default function ServicesList() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('/api/services')
            .then(response => response.json())
            .then(data => setServices(data));
    }, []);

    return (
        <div className="bg-white dark:bg-neutral-800">
            <table>
                <thead>
                <tr>
                    <th className="text-black dark:text-white">ID</th>
                    <th className="text-black dark:text-white">Service</th>
                </tr>
                </thead>
                <tbody>
                {services.map(service => (
                    <tr key={service.id}>
                        <td className="text-black dark:text-white">{service.id}</td>
                        <td className="text-black dark:text-white">{service.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
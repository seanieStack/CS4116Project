"use client"
import { useState } from 'react';

export default function ServicesEdit() {
    const [service, setService] = useState({ id: '', name: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setService({ ...service, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/services/${service.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 p-4">
            <div>
                <label className="text-black dark:text-white">Name</label>
                <input
                    type="text"
                    name="name"
                    value={service.name}
                    onChange={handleChange}
                    className="text-black dark:text-white"
                />
            </div>
            <button type="submit" className="text-blue-500 hover:text-blue-600">
                Save
            </button>
        </form>
    );
}
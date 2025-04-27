"use client";

import { useState } from "react";

export default function BanUser({ buyer }) {
    const [isBanned, setIsBanned] = useState(buyer.banned);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleToggle = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/user/ban", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: buyer.id,
                    banned: !isBanned,
                }),
            });


            if (!res.ok) {
                throw new Error("Failed to update ban status");
            }

            setIsBanned(!isBanned);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <input
                type="checkbox"
                checked={isBanned}
                onChange={handleToggle}
                disabled={loading}
                className="checkbox checkbox-sm checkbox-error"
            />
            {loading && <span className="ml-2 text-xs text-gray-400">...</span>}
            {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
        </>
    );
}

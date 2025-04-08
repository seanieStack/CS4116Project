"use client";

import { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import logger from "@/util/logger";

export default function OrdersList({ userId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                setLoading(true);
                const response = await fetch(`/api/orders?userId=${userId}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data.orders || []);
                logger.log(`Fetched ${data.orders?.length || 0} orders for user ${userId}`);
            } catch (err) {
                logger.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="text-center py-12">
                <ArrowPathIcon className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">You haven't placed any orders yet.</p>
                <Link href="/services" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Browse Services
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                    <div key={order.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                    {order.product.image ? (
                                        <img
                                            src={order.product.image}
                                            alt={order.product.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="text-gray-500 dark:text-gray-400 text-xs">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        <Link href={`/services/${order.product.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                            {order.product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Purchased on {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                    €{order.product.price.toFixed(2)}
                                </p>
                                <div className="mt-2 flex items-center">
                                    {order.business.logo ? (
                                        <img
                                            src={order.business.logo}
                                            alt={order.business.name}
                                            className="h-6 w-6 rounded-full mr-2"
                                        />
                                    ) : (
                                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">
                                            {order.business.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {order.business.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <Link href={`/services/${order.product.id}`} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                View Service
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
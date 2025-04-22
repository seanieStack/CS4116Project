"use client"

import {redirect} from "next/navigation";
import logger from "@/util/logger";

export default function PurchasePanel({service, user}) {

    const handlePurchase = async () => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serviceId: service.id,
                    buyerId: user.id,
                    businessId: service.businessId
                }),
            });

            if (!response.ok) {
                logger.error('Failed to create order');
            }
        } catch (error) {
            logger.error('Error creating order:', error);
        }
        redirect("/profile/orders");
    };

    return (
        <div className="flex overflow-auto bg-gradient-to-b h-[calc(100vh-8em)] from-blue-100 to-white dark:from-blue-950 dark:to-gray-900">
            <div className="container mx-auto p-6 mt-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                    <div className="p-6">
                        <h2 className="font-bold text-2xl mb-6">Complete Your Purchase</h2>

                        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 className="font-semibold text-xl mb-4">Order Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span>Service:</span>
                                        <span className="font-semibold">{service.name}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Price:</span>
                                        <span className="font-semibold">€{(service.price).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>VAT:</span>
                                        <span className="font-semibold">€{(service.price * 0.21).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Service fee:</span>
                                        <span className="font-semibold">€{(service.price * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-gray-300 dark:bg-gray-600 my-4"></div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>€{(service.price + service.price * 0.21 + service.price * 0.1).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h3 className="font-semibold text-xl mb-4">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                            value={user.name}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                            value={user.email}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                            value="(087) 123-4567"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-semibold text-xl mb-4">Payment Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                            value="1234 5678 9012 3456"
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Name on Card</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                            value={user.name}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Expiration Date</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                            value="12/2045"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label className="block mb-2">CVV</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                                value="123"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">Billing Eircode</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-not-allowed opacity-75"
                                            value="V94 T9PX"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <button onClick={() => redirect(`/services/${service.id}`)} className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded">
                                Back to Service
                            </button>
                            <button onClick={handlePurchase} className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-3 rounded font-bold">
                                Complete Purchase
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
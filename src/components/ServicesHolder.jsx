"use client"

import {useEffect, useState} from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ServiceCard from "@/components/ServiceCard";

async function getServices(filters = {}) {
    const params = new URLSearchParams();

    if (filters.searchTerm) {
        params.append('search', filters.searchTerm);
    }

    if (filters.filters && filters.filters.length > 0) {
        params.append('filters', filters.filters.join(','));
    }

    if (filters.minPrice !== undefined) {
        params.append('minPrice', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        params.append('maxPrice', filters.maxPrice);
    }

    if (filters.sortBy) {
        params.append('sort', filters.sortBy);
    }

    const response = await fetch(`/api/services/get?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch services');
    }

    return response.json();
}

export default function ServicesHolder() {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [debouncedMinPrice, setDebouncedMinPrice] = useState('');
    const [debouncedMaxPrice, setDebouncedMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('');

    const filterOptions = ["Services", "Review", "Cloud"];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMinPrice(minPrice);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [minPrice]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMaxPrice(maxPrice);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [maxPrice]);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const data = await getServices({
                    searchTerm: debouncedSearchTerm,
                    filters: activeFilters,
                    minPrice: debouncedMinPrice || undefined,
                    maxPrice: debouncedMaxPrice || undefined,
                    sortBy,
                });
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [debouncedSearchTerm, activeFilters, debouncedMinPrice, debouncedMaxPrice, sortBy]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const handleSort = (sortOption) => {
        setSortBy(sortOption);
    };

    const handlePriceChange = (type, value) => {
        if (type === 'min') {
            setMinPrice(value);
        } else if (type === 'max') {
            setMaxPrice(value);
        }
    };

    return (
        <div className="w-full p-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-6 bg-gradient-to-b from-blue-200 dark:from-blue-950">

            <FilterSidebar
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={toggleFilter}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                className="col-span-1"
            />

            <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-5">
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border p-2 rounded-lg w-full md:w-1/3 bg-gray-700 text-white"
                    />
                    <div className="flex flex-wrap gap-2">
                        <button
                            className={`border px-4 py-2 rounded ${sortBy === 'price_asc' ? 'bg-blue-600' : ''}`}
                            onClick={() => handleSort('price_asc')}>
                            Price ↑
                        </button>
                        <button
                            className={`border px-4 py-2 rounded ${sortBy === 'price_desc' ? 'bg-blue-600' : ''}`}
                            onClick={() => handleSort('price_desc')}>
                            Price ↓
                        </button>
                        <button className={`border px-4 py-2 rounded ${sortBy === 'rating' ? 'bg-blue-600' : ''}`}
                                onClick={() => handleSort('rating')}>
                            Rating
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {services.length > 0 ? (
                            services.map((service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))
                        ) : (
                            <p className="text-white col-span-full">No services found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
export default function FilterSidebar({
                                          filterOptions,
                                          activeFilters,
                                          onFilterChange,
                                          minPrice,
                                          maxPrice,
                                          onPriceChange
                                      }) {
    return (
        <div className="col-span-1 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white top-20 h-fit">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>

            <div className="mb-4">
                <h3 className="font-medium">Keywords</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {filterOptions.map(filter => (
                        <button key={filter}
                                onClick={() => onFilterChange(filter)}
                                className={`px-3 py-1 rounded-md text-sm ${
                                    activeFilters.includes(filter)
                                        ? 'bg-blue-500 dark:bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}>
                            {filter} {activeFilters.includes(filter) && '✕'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        className="w-1/2 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => onPriceChange('min', e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        className="w-1/2 p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => onPriceChange('max', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
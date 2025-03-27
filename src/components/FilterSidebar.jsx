export default function FilterSidebar({
                                          filterOptions,
                                          activeFilters,
                                          onFilterChange,
                                          minPrice,
                                          maxPrice,
                                          onPriceChange
                                      }) {
    return (
        <div className="col-span-1 p-4 border rounded-lg shadow-lg bg-gray-800 text-white top-20 h-fit">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>

            <div className="mb-4">
                <h3 className="font-medium">Keywords</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {filterOptions.map(filter => (
                        <button key={filter}
                                onClick={() => onFilterChange(filter)}
                                className={`px-3 py-1 rounded-md text-sm ${activeFilters.includes(filter) ? 'bg-blue-600' : 'bg-gray-600'}`}>
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
                        className="w-1/2 p-2 bg-gray-700 rounded"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => onPriceChange('min', e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        className="w-1/2 p-2 bg-gray-700 rounded"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => onPriceChange('max', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
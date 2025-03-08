import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Services() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 grid grid-cols-4 gap-6 bg-gradient-to-b from-blue-200 dark:from-blue-950">

        <aside className="col-span-1 p-4 border rounded-lg shadow-lg bg-gray-800 text-white">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>

          <div className="mb-4">
            <h3 className="font-medium">Keywords</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-gray-600 px-3 py-1 rounded-md text-sm">Services ✕</span>
              <span className="bg-gray-600 px-3 py-1 rounded-md text-sm">Review ✕</span>
              <span className="bg-gray-600 px-3 py-1 rounded-md text-sm">Cloud ✕</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Price</h3>
            <input type="range" className="w-full bg-gray-700 rounded-lg" min="0" max="1000" />
          </div>

          <div className="mb-4">
            <h3 className="font-medium">Company Scope</h3>
            <ul>
              <li><input type="checkbox" defaultChecked /> Local</li>
              <li><input type="checkbox" defaultChecked /> National Franchise</li>
              <li><input type="checkbox" defaultChecked /> Multinational</li>
            </ul>
          </div>
        </aside>

        <main className="col-span-3">

          <div className="flex justify-between mb-6">
            <input type="text" placeholder="Search" className="border p-2 text-black rounded-lg w-1/3" />
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">New</button>
              <button className="border px-4 py-2 rounded">Price ascending</button>
              <button className="border px-4 py-2 rounded">Price descending</button>
              <button className="border px-4 py-2 rounded">Rating</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[...Array(13)].map((_, i) => (
              <div key={i} className="border p-4 rounded-lg shadow-lg bg-gradient-to-b from-blue-900 to-purple-900 text-white">
                <div className="h-32 flex items-center justify-center mb-4">
                  <img
                    src={`/images/logo${i + 1}.png`}
                    alt={`Logo ${i + 1}`}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <h3 className="font-semibold">Service Name</h3>
                <p className="text-gray-300">Service Description</p>
                <p className="text-lg font-bold mt-2">€0</p>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
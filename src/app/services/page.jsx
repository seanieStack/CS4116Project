import { PrismaClient } from "@prisma/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

export default async function Services() {
  const services = await prisma.service.findMany({
    include: {
      business: true,
    },
  });

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
        </aside>

        <main className="col-span-3">
          <div className="flex justify-between mb-6">
            <input type="text" placeholder="Search" className="border p-2 text-white rounded-lg w-1/3" />
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">New</button>
              <button className="border px-4 py-2 rounded">Price ascending</button>
              <button className="border px-4 py-2 rounded">Price descending</button>
              <button className="border px-4 py-2 rounded">Rating</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="border p-4 rounded-lg shadow-lg bg-gray-800 text-white">
                  <div className="h-32 flex items-center justify-center mb-4">
                    <img
                      src={service.image || ""}
                      alt={service.name}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-gray-300">{service.description || "No description available"}</p>
                  <p className="text-lg font-bold mt-2">€{service.price.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">
                    Provided by: {service.business?.name || "Unknown Business"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-white">No services found.</p>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

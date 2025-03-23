import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsList from "@/components/ReviewsList";
import MessagesList from "@/components/MessagesList";
import ServicesList from "@/components/ServicesList";
import ServicesEdit from "@/components/ServicesEdit";

export default function AdminPanel() {
  return (
      <>
        <Navbar />
        <div className="container mx-auto px-6 py-12 bg-gradient-to-b from-blue-200 dark:from-blue-950 text-white">

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-gray-300 mt-2">Manage your reviews, messages, and services here.</p>
          </div>

          <div className="grid md:grid-cols-11 gap-12">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <ReviewsList />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Messages</h2>
              <MessagesList />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Services</h2>
              <ServicesList />
              <h2 className="text-2xl font-semibold mt-6 mb-4">Edit Service</h2>
              <ServicesEdit />
            </div>
          </div>
        </div>
        <Footer />
      </>
  );
}
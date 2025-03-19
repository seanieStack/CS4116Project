import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12 bg-gradient-to-b from-blue-200 dark:from-blue-950 text-white">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-300 mt-2">If you have any questions you can contact us here!</p>
        </div>

        <div className="grid md:grid-cols-11 gap-12">

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <input type="text" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium">Your Email</label>
                <input type="email" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium">Your Message</label>
                <textarea rows="4" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" placeholder="Type your message here..."></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>      
        </div>

        <div className="mt-12 w-full h-64 rounded-lg overflow-hidden">
        <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2419.2283775817036!2d-8.578105123392753!3d52.67391362482292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485b5e98d8ed0fa1%3A0xe27b1babe50c86df!2sComputer%20Science%20Building%2C%20University%20of%20Limerick%20Campus%2C%20Plassey%20Park%20Rd%2C%20Sreelane%2C%20Limerick%2C%20Ierland!5e0!3m2!1sen!2sie!4v1741598432723!5m2!1sen!2sie"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
        </div>
      </div>
      <Footer />
    </>
  );
}

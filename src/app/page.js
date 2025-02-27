import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";

export default function Home() {
  return (
      <>
          <Navbar/>
          <Hero/>
          <hr className="dark:hidden mx-auto w-[95%] h-[4px] bg-blue-600 border-0 shadow-[0_0_10px_rgba(59,130,246,0.75)]" style={{ clipPath: "polygon(0% 50%, 10% 100%, 90% 100%, 100% 50%, 90% 0%, 10% 0%)" }}/>
          <Features/>
          <Stats/>
          <Footer/>
      </>
  )
}

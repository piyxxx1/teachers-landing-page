import Hero from "@/components/Hero";
import MiniSlider from "@/components/MiniSlider";
import Courses from "@/components/Courses";
import WhyAttend from "@/components/WhyAttend";
import Webinars from "@/components/Webinars";
import About from "@/components/About";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminLink from "@/components/AdminLink";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <MiniSlider />
      <Courses />
      <WhyAttend />
      <Webinars />
      <About />
      <Footer />
      <WhatsAppButton />
      <AdminLink />
    </div>
  );
};

export default Index;

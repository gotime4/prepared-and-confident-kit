
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MissionPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <span className="mr-2">🧭</span> Our Mission
            </h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
            
            <div className="prose max-w-none">
              <p className="text-lg">
                RelianceHQ exists to empower individuals and families to become spiritually and temporally self-reliant. 
                We provide trusted resources, tools, and guidance to help you prepare for emergencies, build lasting food storage, 
                organize 72-hour kits, and strengthen your faith. 
              </p>
              
              <p className="text-lg mt-4">
                Our mission is rooted in principles of preparedness, service, and spiritual growth, 
                so you can thrive in every season of life — not just survive. Whether you're just getting started or 
                deepening your journey, RelianceHQ is your companion in building a life of peace, readiness, and purpose.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MissionPage;

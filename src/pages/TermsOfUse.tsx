
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <span className="mr-2">⚖️</span> Terms of Use
            </h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
            <p className="text-gray-500">Effective Date: May 2, 2025</p>
            
            <div className="prose max-w-none mt-6">
              <p className="text-lg">Welcome to RelianceHQ. By using our website and services, you agree to the following terms:</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Content</h2>
              <p>All materials provided — including checklists, reports, articles, and tools — are for personal, non-commercial use unless otherwise stated. You may not redistribute or resell content without permission.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">2. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your login credentials. Do not share your account with others.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Use</h2>
              <p>We will store the data you provide (e.g., food storage lists, 72-hour kit items) to enhance your experience. You may delete your data or account at any time.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">4. Future Store & Purchases</h2>
              <p>If we introduce a store, additional terms regarding shipping, returns, and payments will apply and be shared at checkout.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">5. Spiritual Content</h2>
              <p>Any faith-based material on the site is intended to inspire and support — not replace — personal study, prayer, or spiritual counsel.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">6. Disclaimer</h2>
              <p>We are not liable for any loss, injury, or damage arising from use of the site or resources. All preparation advice is offered as general guidance.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to Terms</h2>
              <p>We may update these terms periodically. Continued use of the site implies acceptance of the updated terms.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> Questions? Reach out to us at: <a href="mailto:rhq@pm.me" className="ml-1 text-blue-600 hover:underline">rhq@pm.me</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;

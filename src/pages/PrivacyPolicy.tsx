
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <span className="mr-2">🔒</span> Privacy Policy
            </h1>
            <div className="h-1 w-20 bg-primary mb-6"></div>
            <p className="text-gray-500">Effective Date: May 2, 2025</p>
            
            <div className="prose max-w-none mt-6">
              <p className="text-lg">Your privacy matters to us. RelianceHQ ("we," "us," or "our") is committed to protecting any personal information you share with us.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Account details (e.g., email, name, password) when you sign up</li>
                <li>Data you submit to personalize your 72-hour kit, food storage plans, or reports</li>
                <li>Optional feedback or form submissions</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide personalized content and resources</li>
                <li>To save and retrieve your kit, storage, and readiness data</li>
                <li>To improve our site and develop future features</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your password is securely hashed</li>
                <li>We do not share or sell your personal data</li>
                <li>Only authorized personnel have access to user data</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies & Tracking</h2>
              <p>We may use cookies for session management and site analytics. You can disable cookies through your browser settings.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">5. Third-Party Services</h2>
              <p>We do not use external analytics or ad services that collect your personal data. If this changes, we will update this policy.</p>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>You may request to view, update, or delete your data by contacting us</li>
                <li>You may delete your account at any time</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> For privacy-related concerns, email us at: <a href="mailto:rhq@pm.me" className="ml-1 text-blue-600 hover:underline">rhq@pm.me</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

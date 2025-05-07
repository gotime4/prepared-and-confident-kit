import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SeedBank = () => {
  return (
    <div className="bg-[#f9f6f2] min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto">
          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden mt-20 mb-8 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Assorted seeds in a bowl"
              className="w-full h-64 object-cover object-center"
              style={{ background: '#f9f6f2' }}
            />
          </div>
          {/* Title & Subtitle */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Seed Banks for Long-Term Preparedness</h1>
          <p className="text-lg text-gray-700 text-center mb-10 max-w-2xl mx-auto">
            Learn how to start and maintain a personal seed bank to ensure food security in any emergency.
          </p>
          {/* What is a Seed Bank */}
          <div className="bg-amber-50 rounded-xl p-6 flex items-start gap-4 mb-8 shadow-sm border border-amber-100">
            <span className="bg-amber-100 rounded-full p-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636" /></svg>
            </span>
            <div>
              <h2 className="font-bold text-lg mb-1 text-gray-900">What is a Seed Bank?</h2>
              <p className="text-gray-800 text-base">
                A seed bank is a collection of seeds kept for long-term storage to preserve genetic diversity and ensure self-sufficiency. Personal seed banks are small-scale collections designed for emergency preparedness and food security.
              </p>
            </div>
          </div>
          {/* How to Start Your Own Seed Bank */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Start Your Own Seed Bank</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-2xl font-bold text-amber-500 mb-2">1</span>
              <h3 className="font-semibold text-gray-900 mb-1">Choose Heirloom Seeds</h3>
              <p className="text-gray-700 text-base">Heirloom seeds are varieties that can be replanted each year, unlike hybrids.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-2xl font-bold text-amber-500 mb-2">2</span>
              <h3 className="font-semibold text-gray-900 mb-1">Use Airtight Containers</h3>
              <p className="text-gray-700 text-base">Store seeds in glass jars, mylar bags, or vacuum-sealed bags to protect from moisture and pests.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-2xl font-bold text-amber-500 mb-2">3</span>
              <h3 className="font-semibold text-gray-900 mb-1">Store in a Cool, Dark Place</h3>
              <p className="text-gray-700 text-base">Store seeds in a basement, refrigerator, or other cool, dry location for best longevity.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <span className="text-2xl font-bold text-amber-500 mb-2">4</span>
              <h3 className="font-semibold text-gray-900 mb-1">Label & Rotate</h3>
              <p className="text-gray-700 text-base">Label seeds with type and date, and rotate every 3–5 years to ensure germination. Learn seed-saving techniques as part of your plan.</p>
            </div>
          </div>
          {/* Tip Box */}
          <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3 mb-10 border border-amber-100">
            <span className="bg-amber-100 rounded-full p-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            </span>
            <span className="text-amber-900 text-base">Start with a few staple crops you enjoy eating, and expand your seed bank as your gardening skills develop.</span>
          </div>
          {/* Resources */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-16">
            <ul className="list-disc pl-6 text-gray-700 space-y-2 text-base">
              <li>
                <a href="https://www.seedsavers.org/" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline hover:text-sky-900">Seed Savers Exchange</a> – Heirloom seeds and seed-saving resources
              </li>
              <li>
                <a href="https://www.arkinstitute.com/" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline hover:text-sky-900">The Ark Institute</a> – Non-GMO and open-pollinated seed supplier
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeedBank;

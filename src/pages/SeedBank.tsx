import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SeedBank = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Seed Banks for Long-Term Preparedness</h1>
            <p className="mt-4 text-lg text-gray-600">
              Learn how to start and maintain a personal seed bank to ensure food security and resilience in emergencies.
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What is a Seed Bank?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A seed bank is a collection of seeds stored for long-term preservation and future use. Seed banks can be large institutions that safeguard plant diversity, or small personal collections designed to help individuals and families grow food in times of need.
              </p>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Seed Banks Matter for Food Security</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide a renewable source of food in emergencies or supply disruptions.</li>
                <li>Preserve heirloom and non-GMO varieties that may be more resilient or nutritious.</li>
                <li>Support self-sufficiency and reduce dependence on commercial seed suppliers.</li>
                <li>Enable crop diversity, which is vital for healthy, resilient gardens and food systems.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>How to Start Your Own Seed Bank</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Choose Heirloom or Open-Pollinated Seeds:</strong> These varieties can be saved and replanted year after year, unlike most hybrids.
                </li>
                <li>
                  <strong>Use Airtight, Moisture-Proof Containers:</strong> Store seeds in glass jars, mylar bags, or vacuum-sealed pouches to protect from humidity and pests.
                </li>
                <li>
                  <strong>Keep Seeds Cool and Dark:</strong> Store your seed bank in a refrigerator, freezer, or cool basement. Consistent temperatures below 50°F (10°C) are ideal.
                </li>
                <li>
                  <strong>Label and Organize:</strong> Clearly mark each container with the seed type and date. Rotate your stock and use older seeds first.
                </li>
                <li>
                  <strong>Test Germination:</strong> Every 1–2 years, test a few seeds for sprouting. Replace low-viability seeds with fresh stock.
                </li>
                <li>
                  <strong>Grow and Save:</strong> Practice growing your crops and saving seeds each season to maintain your supply and skills.
                </li>
              </ol>
              <div className="border-l-4 border-amber-400 pl-4 py-1 bg-amber-50">
                <p className="text-amber-800 text-sm">
                  Tip: Start small with a few staple crops you enjoy eating, and expand your seed bank as your gardening experience grows.
                </p>
              </div>
            </CardContent>
          </Card>
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What Is a Seed Bank?</h2>
            <p className="text-gray-700 text-lg mb-2">
              A seed bank is a collection of seeds stored for long-term survival, emergency preparedness, and self-reliance. Whether personal or institutional, seed banks help preserve plant diversity and ensure you can grow food in times of need.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Have One?</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 text-lg">
              <li>Ensures you can grow your own food during disruptions</li>
              <li>Protects against rising food prices and shortages</li>
              <li>Allows you to preserve non-GMO heirloom varieties</li>
              <li>Promotes self-reliance and community resilience</li>
              <li>Supports long-term food security for your family</li>
            </ul>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Seed Bank Tips</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 text-lg">
              <li>Use <strong>heirloom</strong> or <strong>open-pollinated</strong> seeds for long-term viability and seed-saving</li>
              <li>Store seeds in a <strong>cool, dark, and dry</strong> environment</li>
              <li>Use <strong>vacuum-sealed bags</strong>, mylar, or glass jars with silica gel packets</li>
              <li>Label everything with plant type, date, and origin</li>
              <li>Keep seeds in a <strong>refrigerator or freezer</strong> for longest shelf life</li>
              <li>Rotate every <strong>3–5 years</strong> to ensure germination</li>
              <li>Learn <strong>seed-saving techniques</strong> as part of your family plan</li>
            </ul>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Resources</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 text-lg">
              <li>
                <a href="https://www.seedsavers.org/" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline hover:text-sky-900">Seed Savers Exchange</a> – Heirloom seeds and seed-saving resources
              </li>
              <li>
                <a href="https://www.arkinstitute.com/" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline hover:text-sky-900">The Ark Institute</a> – Non-GMO and open-pollinated seed supplier
              </li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeedBank;

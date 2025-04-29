
import React from "react";
import { ExternalLink, Package, Utensils, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { motion } from "framer-motion";

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  source: string;
  url: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

const ResourceCard = ({
  icon,
  title,
  source,
  url,
  description,
  iconBgColor,
  iconColor
}: ResourceCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8 md:p-10 flex flex-col h-full">
        <div className={`${iconBgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
          <div className={`${iconColor} w-7 h-7`}>
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        
        <HoverCard>
          <HoverCardTrigger>
            <p className="text-sm text-gray-500 mb-4 underline decoration-dotted underline-offset-2 cursor-help">
              Source: {source}
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="text-sm">
            View the original resource at this trusted organization.
          </HoverCardContent>
        </HoverCard>
        
        <p className="text-gray-700 flex-grow mb-8">
          {description}
        </p>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-5 rounded-full hover:bg-gray-800 transition-colors w-full font-medium text-center"
        >
          Visit Resource
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
};

const TrustedResources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header Section */}
        <section className="bg-gray-50 py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted Preparedness Resources
              </h1>
              <p className="text-lg text-gray-600">
                Carefully selected expert guides to help you build confidence in your family's emergency preparedness.
              </p>
            </div>
          </div>
        </section>
        
        {/* Resources Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              
              {/* Emergency Kits Card */}
              <ResourceCard
                icon={<Package />}
                title="Emergency Kits (72-Hour)"
                source="Ready.gov – Emergency Kit Guide"
                url="https://www.ready.gov/kit"
                description="The official U.S. guide to building a 72-hour emergency kit for disasters and evacuations."
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              
              {/* Long-Term Food Storage Card */}
              <ResourceCard
                icon={<Utensils />}
                title="Long-Term Food Storage"
                source="Utah State University – Food Storage Basics"
                url="https://extension.usu.edu/foodstorage/"
                description="Evidence-based food storage tips from university experts on shelf life, packaging, and nutrition."
                iconBgColor="bg-amber-50"
                iconColor="text-amber-600"
              />
              
              {/* LDS Self-Reliance Card */}
              <ResourceCard
                icon={<Users />}
                title="LDS Self-Reliance"
                source="The Church of Jesus Christ – Self-Reliance Resources"
                url="https://www.churchofjesuschrist.org/self-reliance"
                description="Official tools and courses for building spiritual, financial, and emergency preparedness self-reliance."
                iconBgColor="bg-emerald-50"
                iconColor="text-emerald-600"
              />
              
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrustedResources;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Box, Utensils, Water } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-16 md:pt-20 lg:pt-24">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative min-h-[90vh] flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
            <div className="max-w-3xl">
              <h1 
                className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 opacity-0 ${isVisible ? 'animate-fade-in' : ''}`}
              >
                Be Ready. <br />Be Confident.
              </h1>
              <p 
                className={`mt-6 text-lg md:text-xl text-gray-700 max-w-md opacity-0 ${isVisible ? 'animate-fade-in stagger-1' : ''}`}
              >
                Master your family's self-reliance with beautifully simple tools, lists, and guides.
              </p>
              <div className={`mt-10 opacity-0 ${isVisible ? 'animate-fade-in stagger-2' : ''}`}>
                <Link to="/kit">
                  <Button className="rounded-full px-6 py-6 text-base bg-gray-900 hover:bg-gray-800 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Essential Preparedness Resources
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive guides designed to help you prepare for any situation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 72-Hour Kit Card */}
            <Link to="/kit" className="group">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
                <div className="p-6 md:p-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Box className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">72-Hour Kits</h3>
                  <p className="text-gray-600">
                    Everything you need to survive the first critical hours of an emergency.
                  </p>
                </div>
                <div className="px-6 pb-6 md:px-8 md:pb-8">
                  <span className="text-blue-600 font-medium inline-flex items-center group-hover:underline">
                    Learn more
                    <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Food Storage Card */}
            <Link to="/food" className="group">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
                <div className="p-6 md:p-8">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <Utensils className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Food Storage</h3>
                  <p className="text-gray-600">
                    Long-term food storage strategies and recommended supplies for your family.
                  </p>
                </div>
                <div className="px-6 pb-6 md:px-8 md:pb-8">
                  <span className="text-amber-600 font-medium inline-flex items-center group-hover:underline">
                    Learn more
                    <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Water Storage Card */}
            <Link to="/water" className="group">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
                <div className="p-6 md:p-8">
                  <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center mb-6">
                    <Water className="h-6 w-6 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Water Storage</h3>
                  <p className="text-gray-600">
                    Essential information on safely storing and purifying water for emergencies.
                  </p>
                </div>
                <div className="px-6 pb-6 md:px-8 md:pb-8">
                  <span className="text-sky-600 font-medium inline-flex items-center group-hover:underline">
                    Learn more
                    <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24 section-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="h-10 w-10 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl md:text-2xl font-medium text-gray-800">
              "This guide has completely transformed how our family approaches emergency preparedness. 
              Instead of feeling anxious, we now feel confident that we're ready for whatever comes our way."
            </p>
            <div className="mt-6">
              <span className="text-base font-semibold text-gray-900">Sarah Johnson</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-500">Mother of three, Utah</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

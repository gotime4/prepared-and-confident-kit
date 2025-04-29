import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Utensils, Droplets, Menu, X, ExternalLink } from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isScrolled: boolean;
}

const NavLink = ({ to, icon, label, isScrolled }: NavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 py-2 px-4 rounded-md transition-colors hover:bg-gray-100 ${
      isScrolled ? "text-gray-900" : "text-gray-900"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center">
            <span 
              className={`font-bold text-xl transition-colors ${
                isScrolled ? "text-gray-900" : "text-gray-900"
              }`}
            >
              Reliance<span className="text-sky-600">HQ</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/kit" icon={<Box size={18} />} label="72-Hour Kits" isScrolled={isScrolled} />
            <NavLink to="/food" icon={<Utensils size={18} />} label="Food Storage" isScrolled={isScrolled} />
            <NavLink to="/water" icon={<Droplets size={18} />} label="Water Storage" isScrolled={isScrolled} />
            <NavLink to="/resources" icon={<ExternalLink size={18} />} label="Resources" isScrolled={isScrolled} />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          mobileMenuOpen ? "max-h-64" : "max-h-0"
        } bg-white overflow-hidden transition-all duration-300 shadow-sm`}
      >
        <div className="container mx-auto px-4 py-2">
          <Link to="/kit" className="block py-2 px-4 text-gray-900 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <Box size={18} />
              <span>72-Hour Kits</span>
            </div>
          </Link>
          <Link to="/food" className="block py-2 px-4 text-gray-900 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <Utensils size={18} />
              <span>Food Storage</span>
            </div>
          </Link>
          <Link to="/water" className="block py-2 px-4 text-gray-900 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <Droplets size={18} />
              <span>Water Storage</span>
            </div>
          </Link>
          <Link to="/resources" className="block py-2 px-4 text-gray-900 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <ExternalLink size={18} />
              <span>Resources</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

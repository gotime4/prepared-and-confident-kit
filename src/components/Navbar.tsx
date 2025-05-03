
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Utensils, Droplets, Menu, X, ExternalLink, FileText, Home, ChevronDown, BookOpen } from "lucide-react";
import { UserProfile } from "./UserProfile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

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

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

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
            {/* Dropdown Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                    <div className="flex items-center">
                      <Home size={18} className="mr-2" />
                      <span>Prepare Your Home</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      <Link to="/kit" className="group">
                        <ListItem title="72-Hour Kits">
                          <div className="flex items-center">
                            <Box size={16} className="mr-2 text-sky-600" />
                            <span>Essential supplies for immediate emergency response</span>
                          </div>
                        </ListItem>
                      </Link>
                      <Link to="/food" className="group">
                        <ListItem title="Food Storage">
                          <div className="flex items-center">
                            <Utensils size={16} className="mr-2 text-sky-600" />
                            <span>Long-term food preparation and storage strategies</span>
                          </div>
                        </ListItem>
                      </Link>
                      <Link to="/water" className="group">
                        <ListItem title="Water Storage">
                          <div className="flex items-center">
                            <Droplets size={16} className="mr-2 text-sky-600" />
                            <span>Water storage and purification methods</span>
                          </div>
                        </ListItem>
                      </Link>
                      <Link to="/family-emergency-plan" className="group">
                        <ListItem title="Family Emergency Plan">
                          <div className="flex items-center">
                            <BookOpen size={16} className="mr-2 text-sky-600" />
                            <span>Create and maintain a household emergency plan</span>
                          </div>
                        </ListItem>
                      </Link>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/report" icon={<FileText size={18} />} label="Readiness Report" isScrolled={isScrolled} />
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/resources" icon={<ExternalLink size={18} />} label="Resources" isScrolled={isScrolled} />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* User Profile / Login Button */}
          <div className="flex items-center ml-4">
            <UserProfile />
          </div>

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
          mobileMenuOpen ? "max-h-screen" : "max-h-0"
        } bg-white overflow-hidden transition-all duration-300 shadow-sm`}
      >
        <div className="container mx-auto px-4 py-2 space-y-1">
          {/* Home Preparation Section with Dropdown */}
          <div className="py-2 px-4 text-gray-900">
            <div className="flex items-center space-x-2">
              <Home size={18} />
              <span className="font-medium">Prepare Your Home</span>
            </div>
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-100 pl-2">
              <Link to="/kit" className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <div className="flex items-center space-x-2">
                  <Box size={16} />
                  <span>72-Hour Kits</span>
                </div>
              </Link>
              <Link to="/food" className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <div className="flex items-center space-x-2">
                  <Utensils size={16} />
                  <span>Food Storage</span>
                </div>
              </Link>
              <Link to="/water" className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <div className="flex items-center space-x-2">
                  <Droplets size={16} />
                  <span>Water Storage</span>
                </div>
              </Link>
              <Link to="/family-emergency-plan" className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <div className="flex items-center space-x-2">
                  <BookOpen size={16} />
                  <span>Family Emergency Plan</span>
                </div>
              </Link>
            </div>
          </div>

          <Link to="/report" className="block py-2 px-4 text-gray-900 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <FileText size={18} />
              <span>Readiness Report</span>
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

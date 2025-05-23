import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Utensils, Droplets, Menu, X, ExternalLink, FileText, Home, ChevronDown, BookOpen } from "lucide-react";
import { UserProfile } from "./UserProfile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuContentRight,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

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

// Custom NavigationMenu with right-aligned viewport for the Resources dropdown
const NavigationMenuWithRightViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <div className="absolute right-0 top-full flex justify-end">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-right relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]"
        )}
      />
    </div>
  </NavigationMenuPrimitive.Root>
));
NavigationMenuWithRightViewport.displayName = "NavigationMenuWithRightViewport";

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
            {/* Prepare Your Home Dropdown Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                    <div className="flex items-center">
                      <Home size={18} className="mr-2" />
                      <span>Prepare Your Home</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-0 min-w-[400px]">
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
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavLink to="/report" icon={<FileText size={18} />} label="Readiness Report" isScrolled={isScrolled} />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Resources Dropdown Menu with Right-Aligned Viewport */}
            <NavigationMenuWithRightViewport>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-100">
                    <div className="flex items-center">
                      <ExternalLink size={18} className="mr-2" />
                      <span>Resources</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[400px]">
                    <ul className="grid w-[400px] gap-2 p-4">
                      <Link to="/seedbank" className="group">
                        <ListItem title="Seed Bank">
                          <div className="flex items-center">
                            <Box size={16} className="mr-2 text-sky-600" />
                            <span>Long-term preparedness with heirloom seeds</span>
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
                      <Link to="/resources" className="group">
                        <ListItem title="Trusted Preparedness Resources">
                          <div className="flex items-center">
                            <ExternalLink size={16} className="mr-2 text-sky-600" />
                            <span>Carefully selected links for your family's emergency planning</span>
                          </div>
                        </ListItem>
                      </Link>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenuWithRightViewport>
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
            </div>
          </div>

          <Link to="/report" className="block py-2 px-4 text-gray-900 hover:bg-gray-100 rounded-md">
            <div className="flex items-center space-x-2">
              <FileText size={18} />
              <span>Readiness Report</span>
            </div>
          </Link>

          {/* Resources Section with Dropdown */}
          <div className="py-2 px-4 text-gray-900">
            <div className="flex items-center space-x-2">
              <ExternalLink size={18} />
              <span className="font-medium">Resources</span>
            </div>
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-100 pl-2">
              <Link to="/seedbank" className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <div className="flex items-center space-x-2">
                  <Box size={16} />
                  <span>Seed Bank</span>
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
              <Link to="/resources" className="block py-2 px-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <div className="flex items-center space-x-2">
                  <ExternalLink size={16} />
                  <span>Trusted Preparedness Resources</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

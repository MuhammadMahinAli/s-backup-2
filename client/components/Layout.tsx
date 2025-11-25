import { Link, useLocation } from "react-router-dom";
import { ReactNode, useState } from "react";
import ShyChat from "./ShyChat";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-[#D4EDF4] px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="SHY Project Logo"
                className="w-20 h-20 object-contain"
              />
            </Link>
          </div>

          {/* Navigation Menu - positioned with some space from the right */}
          <div className="hidden md:flex items-center gap-8 mr-8">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors hover:text-[#006D68] ${isActive("/")
                  ? "text-[#006D68] font-semibold"
                  : "text-[#315E5B]"
                }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-lg font-medium transition-colors hover:text-[#006D68] ${isActive("/about")
                  ? "text-[#006D68] font-semibold"
                  : "text-[#315E5B]"
                }`}
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className={`text-lg font-medium transition-colors hover:text-[#006D68] ${isActive("/blog")
                  ? "text-[#006D68] font-semibold"
                  : "text-[#315E5B]"
                }`}
            >
              Blog
            </Link>
            <Link
              to="/community"
              className={`text-lg font-medium transition-colors hover:text-[#006D68] ${isActive("/community")
                  ? "text-[#006D68] font-semibold"
                  : "text-[#315E5B]"
                }`}
            >
              Community Forum
            </Link>
            <Link
              to="/contact"
              className={`text-lg font-medium transition-colors hover:text-[#006D68] ${isActive("/contact")
                  ? "text-[#006D68] font-semibold"
                  : "text-[#315E5B]"
                }`}
            >
              Contact
            </Link>
          </div>

          {/* Student Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3 mr-4">
            {typeof window !== 'undefined' && localStorage.getItem('authToken') ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-[#315E5B] hover:text-[#006D68] font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('authUser');
                    window.location.href = '/';
                  }}
                  className="text-[#315E5B] hover:text-[#006D68] font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#315E5B] hover:text-[#006D68] font-medium transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-[#006D68] px-4 py-2 rounded-full font-medium shadow hover:shadow-md transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Get Help Button - Desktop */}
          <Link
            to="/get-help"
            className="hidden md:flex bg-gradient-to-r from-[#4BB5B9] to-[#02A0A6] text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg hover:shadow-xl hover:from-[#42A0A3] hover:to-[#028B91] transition-all duration-300 items-center gap-2"
          >
            Get Help
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#315E5B] hover:text-[#006D68] transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#B2E3DF] pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`text-lg font-medium transition-colors hover:text-[#006D68] px-4 py-2 rounded-lg ${isActive("/")
                    ? "text-[#006D68] font-semibold bg-white/50"
                    : "text-[#315E5B]"
                  }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`text-lg font-medium transition-colors hover:text-[#006D68] px-4 py-2 rounded-lg ${isActive("/about")
                    ? "text-[#006D68] font-semibold bg-white/50"
                    : "text-[#315E5B]"
                  }`}
              >
                About Us
              </Link>
              <Link
                to="/blog"
                onClick={closeMobileMenu}
                className={`text-lg font-medium transition-colors hover:text-[#006D68] px-4 py-2 rounded-lg ${isActive("/blog")
                    ? "text-[#006D68] font-semibold bg-white/50"
                    : "text-[#315E5B]"
                  }`}
              >
                Blog
              </Link>
              <Link
                to="/community"
                onClick={closeMobileMenu}
                className={`text-lg font-medium transition-colors hover:text-[#006D68] px-4 py-2 rounded-lg ${isActive("/community")
                    ? "text-[#006D68] font-semibold bg-white/50"
                    : "text-[#315E5B]"
                  }`}
              >
                Community Forum
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className={`text-lg font-medium transition-colors hover:text-[#006D68] px-4 py-2 rounded-lg ${isActive("/contact")
                    ? "text-[#006D68] font-semibold bg-white/50"
                    : "text-[#315E5B]"
                  }`}
              >
                Contact
              </Link>

              {/* Student Auth buttons for mobile */}
              {typeof window !== 'undefined' && localStorage.getItem('authToken') ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-[#315E5B] hover:text-[#006D68] px-4 py-2 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('authToken');
                      localStorage.removeItem('authUser');
                      window.location.href = '/';
                    }}
                    className="text-lg font-medium text-[#315E5B] hover:text-[#006D68] px-4 py-2 rounded-lg text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="text-lg font-medium text-[#315E5B] hover:text-[#006D68] px-4 py-2 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="bg-white text-[#006D68] px-6 py-2 rounded-full font-medium shadow mx-4"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <Link
                to="/get-help"
                onClick={closeMobileMenu}
                className="bg-gradient-to-r from-[#4BB5B9] to-[#02A0A6] text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg text-center mx-4 mt-2"
              >
                Get Help
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="bg-[#D4EDF4] px-4 sm:px-6 lg:px-18 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Branding */}
            <div className="space-y-6 max-w-[360px]">
              <div className="w-full">
                <img
                  src="/taylors.png"
                  alt="Taylor's University"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-sm text-[#315E5B] leading-relaxed">
                Empowering young people with sexual health knowledge and resources.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-[#002927] mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/about" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  About Us
                </Link>
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Resources
                </a>
                <Link to="/get-help" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Get Help
                </Link>
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Contact
                </a>
              </div>
            </div>

            {/* Partners */}
            <div>
              <h3 className="text-lg font-semibold text-[#002927] mb-6">Partners</h3>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Taylor's University
                </a>
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Malaysian AIDS Council
                </a>
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Ministry of Health
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold text-[#002927] mb-6">Legal</h3>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Accessibility
                </a>
                <a href="#" className="block text-sm text-[#315E5B] hover:text-[#002927] transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#B2E3DF] pt-8">
            <p className="text-sm text-[#315E5B] text-center">
              © 2024 Taylor's University · SHY - Sexual Health for Youth. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot - Appears on all pages */}
      <ShyChat />
    </div>
  );
}

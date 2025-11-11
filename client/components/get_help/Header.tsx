import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-health-background px-4 py-4">
      <div className="max-w-[1296px] mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f7796232331e77ec35757bb67b1695dcfde743c0?width=140"
              alt="SHY Logo"
              className="w-12 h-12 sm:w-[70px] sm:h-[72px]"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/fdbe729452db915009e7ed598b6ff42ba0a4fd13?width=276"
              alt="Taylor's University"
              className="w-20 h-6 sm:w-[138px] sm:h-[44px]"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              to="/"
              className="text-[#3F4346] text-lg xl:text-xl font-semibold capitalize hover:text-health-primary transition-colors"
            >
              home
            </Link>
            <Link
              to="/about"
              className="text-[#3F4346] text-lg xl:text-xl font-semibold capitalize hover:text-health-primary transition-colors"
            >
              about
            </Link>
            <Link
              to="/learn"
              className="text-[#3F4346] text-lg xl:text-xl font-semibold capitalize hover:text-health-primary transition-colors"
            >
              learn
            </Link>
            <Link
              to="/getting-help"
              className="text-[#3F4346] text-lg xl:text-xl font-semibold capitalize hover:text-health-primary transition-colors"
            >
              getting help
            </Link>
            <Link
              to="/events"
              className="text-[#3F4346] text-lg xl:text-xl font-semibold capitalize hover:text-health-primary transition-colors"
            >
              events
            </Link>
            <Link
              to="/contact"
              className="text-[#3F4346] text-lg xl:text-xl font-semibold capitalize hover:text-health-primary transition-colors"
            >
              contact
            </Link>
          </div>

          {/* Desktop Get Help Button */}
          <Link to="/get-help" className="hidden sm:block px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-[rgba(75,181,185,0.8)] to-[rgba(2,160,166,0.8)] rounded-full text-white font-semibold text-sm lg:text-base border border-[rgba(0,120,226,0.2)] shadow-[0_10px_15px_-3px_rgba(0,120,226,0.3),0_4px_6px_-4px_rgba(0,120,226,0.3)] backdrop-blur-md hover:opacity-90 transition-opacity">
            Get Help
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-health-light pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-[#3F4346] text-lg font-semibold capitalize hover:text-health-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                home
              </Link>
              <Link
                to="/about"
                className="text-[#3F4346] text-lg font-semibold capitalize hover:text-health-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                about
              </Link>
              <Link
                to="/learn"
                className="text-[#3F4346] text-lg font-semibold capitalize hover:text-health-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                learn
              </Link>
              <Link
                to="/getting-help"
                className="text-[#3F4346] text-lg font-semibold capitalize hover:text-health-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                getting help
              </Link>
              <Link
                to="/events"
                className="text-[#3F4346] text-lg font-semibold capitalize hover:text-health-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                events
              </Link>
              <Link
                to="/contact"
                className="text-[#3F4346] text-lg font-semibold capitalize hover:text-health-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                contact
              </Link>
              <Link to="/get-help" className="sm:hidden self-start px-6 py-3 bg-gradient-to-r from-[rgba(75,181,185,0.8)] to-[rgba(2,160,166,0.8)] rounded-full text-white font-semibold text-base border border-[rgba(0,120,226,0.2)] shadow-[0_10px_15px_-3px_rgba(0,120,226,0.3),0_4px_6px_-4px_rgba(0,120,226,0.3)] backdrop-blur-md hover:opacity-90 transition-opacity">
                Get Help
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header - Same as homepage */}
      <header className="w-full bg-shy-light-blue px-8 md:px-17 py-4">
        <nav className="flex items-center justify-between max-w-[1296px] mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-7">
            <Link to="/">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f7796232331e77ec35757bb67b1695dcfde743c0?width=140"
                alt="SHY Project Logo"
                className="w-[70px] h-[72px]"
              />
            </Link>
            <Link to="/">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/fdbe729452db915009e7ed598b6ff42ba0a4fd13?width=276"
                alt="Taylor's University"
                className="w-[138px] h-11"
              />
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center gap-8 lg:gap-9">
            <Link
              to="/"
              className="text-shy-nav-text text-xl font-normal hover:text-shy-ebony transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-shy-nav-text text-xl font-normal hover:text-shy-ebony transition-colors"
            >
              About
            </Link>
            <Link
              to="/learn"
              className="text-shy-nav-text text-xl font-normal hover:text-shy-ebony transition-colors"
            >
              Learn
            </Link>
            <Link
              to="/getting-help"
              className="text-shy-nav-text text-xl font-normal hover:text-shy-ebony transition-colors"
            >
              Getting Help
            </Link>
            <Link
              to="/events"
              className="text-shy-nav-text text-xl font-normal hover:text-shy-ebony transition-colors"
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-shy-nav-text text-xl font-normal hover:text-shy-ebony transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Get Help Button */}
          <button className="bg-gradient-to-r from-[rgba(75,181,185,0.8)] to-[rgba(2,160,166,0.8)] text-shy-hero-bg px-6 py-3 rounded-full text-base font-semibold shadow-lg border border-[rgba(0,120,226,0.2)] backdrop-blur-md hover:shadow-xl transition-all">
            Get Help
          </button>
        </nav>
      </header>

      {/* Placeholder Content */}
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-shy-ebony text-4xl md:text-5xl font-bold">
            {title}
          </h1>

          {description && (
            <p className="text-shy-oxford-blue text-xl leading-relaxed">
              {description}
            </p>
          )}

          <div className="bg-shy-grey-91 rounded-lg p-8 mt-8">
            <h2 className="text-shy-ebony text-2xl font-semibold mb-4">
              Page Under Development
            </h2>
            <p className="text-shy-river-bed text-lg mb-6">
              This page is currently being developed. Please check back soon for
              more content, or continue exploring the site to learn more about
              The SHY Project.
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-[rgba(75,181,185,0.8)] to-[rgba(2,160,166,0.8)] text-shy-hero-bg px-8 py-3 rounded-full text-lg font-semibold shadow-lg border border-[rgba(0,120,226,0.2)] backdrop-blur-md hover:shadow-xl transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

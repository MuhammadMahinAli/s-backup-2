import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-health-background py-20">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/9c5031e404985180093defb123866f6d4e924684?width=140"
                alt="SHY Logo"
                className="w-[70px] h-[72px]"
              />
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/633ae730f90ffd5b4c113873257618c0295f13e0?width=188"
                alt="Taylor's University"
                className="w-[94px] h-[67px]"
              />
            </div>
            <p className="text-sm text-health-text leading-relaxed">
              Empowering young people with sexual health knowledge and
              resources.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-health-dark">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link
                to="/about"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/resources"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Resources
              </Link>
              <Link
                to="/getting-help"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Get Help
              </Link>
              <Link
                to="/contact"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Partners */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-health-dark">Partners</h3>
            <div className="space-y-2">
              <a
                href="https://university.taylors.edu.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Taylor's University
              </a>
              <a
                href="https://mac.org.my/v4/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Malaysian AIDS Council
              </a>
              <a
                href="https://www.moh.gov.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Ministry of Health
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-health-dark">Legal</h3>
            <div className="space-y-2">
              <Link
                to="/privacy"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/accessibility"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Accessibility
              </Link>
              <Link
                to="/terms"
                className="block text-sm text-health-text hover:text-health-secondary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-health-light">
          <p className="text-sm text-health-text text-center">
            © 2024 Taylor's University · SHY - Sexual Health for Youth. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

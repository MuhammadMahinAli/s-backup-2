import { useState } from "react";
import { Mail, Globe, MapPin, MessageCircle, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-grey-light">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-20 lg:py-24"
        style={{
          backgroundImage: 'url("/contact.png")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-grey-light/60 to-grey-light/60"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-azure-dark mb-6 leading-tight">
            Let's Connect
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-azure-medium leading-relaxed">
              Got a question, need help, or want to collaborate? We're here to
              support you on your journey to better sexual health and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Email Us Card */}
            <div className="bg-white rounded-2xl border border-grey-border shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-azure-dark mb-2">
                Email Us
              </h3>
              <p className="text-sm text-azure-medium mb-4">
                Send us a message anytime
              </p>
              <a
                href="mailto:shyproject.taylors@gmail.com"
                className="text-cyan-primary text-sm font-medium hover:underline"
              >
                shyproject.taylors@gmail.com
              </a>
            </div>

            {/* Visit Website Card */}
            <div className="bg-white rounded-2xl border border-grey-border shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-azure-dark mb-2">
                Visit Website
              </h3>
              <p className="text-sm text-azure-medium mb-4">
                Explore our resources
              </p>
              <a
                href="https://www.ShyTaylors.com"
                className="text-cyan-primary text-sm font-medium hover:underline"
              >
                www.ShyTaylors.com
              </a>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl border border-grey-border shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-azure-dark mb-2">
                Location
              </h3>
              <p className="text-sm text-azure-medium mb-4">
                Find us on campus
              </p>
              <p className="text-cyan-primary text-sm font-medium">
                Taylor's University
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white rounded-2xl border border-grey-border shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-azure-dark mb-2">
                WhatsApp
              </h3>
              <p className="text-sm text-azure-medium mb-4">
                Quick chat support
              </p>
              <p className="text-cyan-primary text-sm font-medium">
                Available via QR codes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-grey-light">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-azure-dark mb-4">
              Send Us a Message
            </h2>
            <p className="text-xl text-azure-medium">
              We'd love to hear from you. Fill out the form below and we'll get
              back to you soon.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-grey-border shadow-xl p-8 lg:p-14">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-azure-light mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#D1D5DC] rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-cyan-primary focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-azure-light mb-2"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#D1D5DC] rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-cyan-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-bold text-azure-light mb-2"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[#D1D5DC] rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-cyan-primary focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-bold text-azure-light mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us more about your question or how we can help..."
          className="w-full px-4 py-3 border border-[#D1D5DC] rounded-lg bg-transparent shadow-sm focus:ring-2 focus:ring-cyan-primary focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-primary text-white rounded-lg font-semibold shadow-sm hover:bg-cyan-primary/90 transition-all"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </div>
    </form>
  );
}

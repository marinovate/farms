import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Footer } from "@/components/marinovate/MarinovateHome";
import {
  ArrowLeft,
  Shield,
  Database,
  Settings,
  Users,
  Lock,
  Globe,
  Scale,
  ExternalLink,
  ShieldAlert,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

const sectionAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function PrivacyPage() {
  const sections = [
    {
      id: "introduction",
      num: "01",
      title: "Introduction",
      icon: Shield,
      content: (
        <p className="leading-relaxed text-gray-600">
          <strong>Marinovate Farms</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our services. By using our website or services, you acknowledge that you have read and understood this Privacy Policy.
        </p>
      ),
    },
    {
      id: "information-we-collect",
      num: "02",
      title: "Information We Collect",
      icon: Database,
      content: (
        <div className="space-y-4 text-gray-600">
          <p className="leading-relaxed">
            We may collect information about you in various ways, including:
          </p>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
            <p className="leading-relaxed">When you fill out forms on our website or contact us, we may collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Name and contact information (email, phone number)</li>
              <li>Business name and address</li>
              <li>Product inquiries and requirements</li>
              <li>Communication history with us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Automatically Collected Information</h3>
            <p className="leading-relaxed">
              When you visit our website, we may automatically collect certain information, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "how-we-use",
      num: "03",
      title: "How We Use Your Information",
      icon: Settings,
      content: (
        <div className="space-y-3 text-gray-600">
          <p className="leading-relaxed">
            We use the collected information for various purposes, including:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {[
              "Responding to inquiries & support",
              "Processing and fulfilling orders",
              "Sending relevant product information",
              "Improving our website and services",
              "Complying with legal obligations",
              "Preventing fraudulent activities",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 bg-[var(--cream)] px-4 py-3 rounded-xl border border-gray-100 font-medium text-gray-700">
                <span className="text-[var(--fresh)]">✦</span> {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: "information-sharing",
      num: "04",
      title: "Information Sharing",
      icon: Users,
      content: (
        <div className="space-y-3 text-gray-600">
          <p className="leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>With service providers who assist in our business operations</li>
            <li>With shipping and logistics partners for order fulfillment</li>
            <li>When required by law or to protect our legal rights</li>
            <li>In connection with a business transfer or merger</li>
          </ul>
        </div>
      ),
    },
    {
      id: "data-security",
      num: "05",
      title: "Data Security",
      icon: Lock,
      content: (
        <p className="leading-relaxed text-gray-600">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      ),
    },
    {
      id: "cookies-tracking",
      num: "06",
      title: "Cookies and Tracking",
      icon: Globe,
      content: (
        <p className="leading-relaxed text-gray-600">
          Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser. Disabling cookies may limit certain features of our website.
        </p>
      ),
    },
    {
      id: "your-rights",
      num: "07",
      title: "Your Rights",
      icon: Scale,
      content: (
        <div className="space-y-3 text-gray-600">
          <p className="leading-relaxed">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "Access your information",
              "Correct inaccurate information",
              "Request deletion",
              "Opt-out of marketing",
              "Data portability",
            ].map((right, idx) => (
              <span key={idx} className="bg-[var(--forest-deep)]/5 text-[var(--forest-deep)] border border-[var(--forest-deep)]/10 px-3 py-1.5 rounded-full text-xs font-semibold">
                {right}
              </span>
            ))}
          </div>
          <p className="leading-relaxed mt-3">
            To exercise any of these rights, please contact us using the information provided below.
          </p>
        </div>
      ),
    },
    {
      id: "third-party-links",
      num: "08",
      title: "Third-Party Links",
      icon: ExternalLink,
      content: (
        <p className="leading-relaxed text-gray-600">
          Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
        </p>
      ),
    },
    {
      id: "childrens-privacy",
      num: "09",
      title: "Children's Privacy",
      icon: ShieldAlert,
      content: (
        <p className="leading-relaxed text-gray-600">
          Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it.
        </p>
      ),
    },
    {
      id: "changes-to-policy",
      num: "10",
      title: "Changes to This Policy",
      icon: RefreshCw,
      content: (
        <p className="leading-relaxed text-gray-600">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically for any changes.
        </p>
      ),
    },
    {
      id: "contact-info",
      num: "11",
      title: "Contact Information",
      icon: Mail,
      content: (
        <div className="space-y-4 text-gray-600">
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <a
              href="mailto:marinovatefarms@gmail.com"
              className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 hover:border-[var(--gold)] transition shadow-sm group"
            >
              <div className="p-3 bg-[var(--cream)] rounded-xl text-[var(--forest-deep)] group-hover:bg-[var(--forest-deep)] group-hover:text-[var(--cream)] transition">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Us</p>
                <p className="font-semibold text-gray-800 break-all text-sm sm:text-base">marinovatefarms@gmail.com</p>
              </div>
            </a>
            <a
              href="tel:8019794244"
              className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 hover:border-[var(--gold)] transition shadow-sm group"
            >
              <div className="p-3 bg-[var(--cream)] rounded-xl text-[var(--forest-deep)] group-hover:bg-[var(--forest-deep)] group-hover:text-[var(--cream)] transition">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Call Us</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">+91 80197 94244</p>
              </div>
            </a>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 sm:col-span-2 shadow-sm">
              <div className="p-3 bg-[var(--cream)] rounded-xl text-[var(--forest-deep)]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Our Headquarters</p>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Secunderabad, Telangana, India</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[var(--cream)] min-h-screen selection:bg-[var(--forest-deep)] selection:text-white">
      {/* Top Header/Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
        <nav className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 backdrop-blur-md shadow-sm">
          <Link to="/" className="flex items-center gap-3 pl-1 pr-4 py-1">
            <img
              src="/logo.png"
              alt="Marinovate Farms"
              className="h-12 w-12 object-contain rounded-xl bg-white shadow-sm"
            />
            <span className="font-display text-[18px] font-bold tracking-tight uppercase mt-1 text-gray-900">
              Marinovate Farms
            </span>
          </Link>
          <div className="mx-2 hidden h-6 w-px bg-black/10 md:block" />
          <Link
            to="/"
            className="rounded-full px-4 py-1.5 text-sm transition text-gray-700 hover:bg-black/5 hover:text-gray-900"
          >
            Back to Home
          </Link>
          <Link
            to="/#products"
            className="hidden sm:block rounded-full px-4 py-1.5 text-sm transition text-gray-700 hover:bg-black/5 hover:text-gray-900"
          >
            Products
          </Link>
          <Link
            to="/#contact"
            className="hidden sm:block rounded-full px-4 py-1.5 text-sm transition text-gray-700 hover:bg-black/5 hover:text-gray-900"
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-[var(--forest-deep)] pt-44 pb-28 text-white px-6 md:px-12 text-center noise">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 to-black/10" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--fresh)]/20 blur-[150px]" />
        
        <div className="relative z-10 mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)] backdrop-blur-md hover:bg-white/20 transition-all mb-6"
          >
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Privacy Policy
          </h1>
          
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-medium text-white/80">
            <Calendar className="h-3.5 w-3.5 text-[var(--gold)]" />
            Last updated: <span className="font-semibold text-white">January 2026</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="mx-auto max-w-4xl px-6 py-20 md:px-12">
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {sections.map((sec) => {
            const IconComponent = sec.icon;
            return (
              <motion.div
                key={sec.id}
                variants={sectionAnimation}
                className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_-20px_rgba(30,86,49,0.08)] transition-all duration-500 group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* Left Column: Number and Icon Indicator */}
                  <div className="flex items-center md:items-start gap-4 md:flex-col shrink-0">
                    <span className="font-display text-3xl font-extrabold text-[var(--gold)] tracking-tight">
                      {sec.num}
                    </span>
                    <div className="p-3 bg-[var(--cream)] rounded-2xl text-[var(--forest-deep)] group-hover:bg-[var(--forest-deep)] group-hover:text-[var(--cream)] transition-colors duration-500">
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  
                  {/* Right Column: Title and Content */}
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-bold text-gray-900 mb-4 group-hover:text-[var(--forest-deep)] transition-colors duration-300">
                      {sec.title}
                    </h2>
                    <div className="prose prose-forest max-w-none">
                      {sec.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Reusable Premium Footer */}
      <Footer />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Footer } from "@/components/marinovate/MarinovateHome";
import {
  ArrowLeft,
  Scale,
  Building,
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  Copyright,
  AlertTriangle,
  Globe,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
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

function TermsPage() {
  const sections = [
    {
      id: "introduction",
      num: "01",
      title: "Introduction",
      icon: Scale,
      content: (
        <p className="leading-relaxed text-gray-600">
          Welcome to <strong>Marinovate Farms</strong>. These Terms and Conditions govern your use of our website and services. By accessing our website or engaging in business with us, you agree to be bound by these terms. Please read them carefully before proceeding.
        </p>
      ),
    },
    {
      id: "business-info",
      num: "02",
      title: "Business Information",
      icon: Building,
      content: (
        <div className="space-y-4 text-gray-600">
          <p className="leading-relaxed">
            <strong>Marinovate Farms</strong> is a registered import and export company based in Secunderabad, Telangana, India. We specialize in wholesale trade of:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            {[
              "Textiles, fabrics, and household linen",
              "Fresh fruits and vegetables",
              "Edible oils",
              "Tea powders",
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
      id: "products-services",
      num: "03",
      title: "Products and Services",
      icon: ShoppingBag,
      content: (
        <div className="space-y-3 text-gray-600">
          <p className="leading-relaxed">
            All products displayed on our website are subject to availability. We reserve the right to modify, discontinue, or change product specifications without prior notice. Product images are for illustration purposes only and may differ from actual products.
          </p>
          <p className="leading-relaxed">
            Prices quoted are subject to change based on market conditions, quantity ordered, and other factors. Final pricing will be confirmed at the time of order confirmation.
          </p>
        </div>
      ),
    },
    {
      id: "order-payment",
      num: "04",
      title: "Order and Payment Terms",
      icon: CreditCard,
      content: (
        <div className="space-y-3 text-gray-600">
          <p className="leading-relaxed">
            Orders are subject to acceptance and confirmation by Marinovate Farms. Payment terms will be specified in individual contracts or invoices. We accept various payment methods including:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "Bank transfer (domestic and international)",
              "Letter of Credit (L/C)",
              "Other mutually agreed payment methods",
            ].map((method, idx) => (
              <span key={idx} className="bg-[var(--forest-deep)]/5 text-[var(--forest-deep)] border border-[var(--forest-deep)]/10 px-3 py-1.5 rounded-full text-xs font-semibold">
                {method}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "shipping-delivery",
      num: "05",
      title: "Shipping and Delivery",
      icon: Truck,
      content: (
        <p className="leading-relaxed text-gray-600">
          Shipping terms (FOB, CIF, etc.) will be specified in individual contracts. Delivery timelines are estimates and may vary based on factors beyond our control. Risk of loss transfers as per the agreed Incoterms. We are not responsible for delays caused by customs, shipping carriers, or force majeure events.
        </p>
      ),
    },
    {
      id: "quality-assurance",
      num: "06",
      title: "Quality Assurance",
      icon: ShieldCheck,
      content: (
        <p className="leading-relaxed text-gray-600">
          We are committed to providing quality products that meet specified standards. Quality inspection certificates will be provided where applicable. Claims for defective or non-conforming goods must be made within 7 days of delivery with supporting documentation and photographs.
        </p>
      ),
    },
    {
      id: "intellectual-property",
      num: "07",
      title: "Intellectual Property",
      icon: Copyright,
      content: (
        <p className="leading-relaxed text-gray-600">
          All content on this website, including text, images, logos, and designs, is the property of <strong>Marinovate Farms</strong> and is protected by intellectual property laws. Unauthorized use, reproduction, or distribution is prohibited.
        </p>
      ),
    },
    {
      id: "limitation-liability",
      num: "08",
      title: "Limitation of Liability",
      icon: AlertTriangle,
      content: (
        <p className="leading-relaxed text-gray-600">
          To the maximum extent permitted by law, Marinovate Farms shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our liability is limited to the value of goods or services provided.
        </p>
      ),
    },
    {
      id: "governing-law",
      num: "09",
      title: "Governing Law",
      icon: Globe,
      content: (
        <p className="leading-relaxed text-gray-600">
          These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India, unless otherwise agreed in writing.
        </p>
      ),
    },
    {
      id: "amendments",
      num: "10",
      title: "Amendments",
      icon: RefreshCw,
      content: (
        <p className="leading-relaxed text-gray-600">
          We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this website. Continued use of our services constitutes acceptance of the modified terms.
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
            For questions or inquiries regarding these Terms and Conditions or our services, please reach out to us:
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
            Terms & Conditions
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

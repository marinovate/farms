import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Leaf, Fish, Apple, Truck, ShieldCheck, Clock, Package, MapPin, Phone, Mail,
  Sparkles, ArrowUpRight, ArrowRight, Star, ChevronDown, Snowflake, Search,
  BadgeCheck, Boxes, Sun, Waves, Heart, Brain,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import vegImg from "@/assets/vegetables.jpg";
import fruitImg from "@/assets/fruits.jpg";
import seaImg from "@/assets/seafood.jpg";
import storyImg from "@/assets/story.jpg";

/* ------------------------------------------------------------------ */
/* Nav                                                                */
/* ------------------------------------------------------------------ */
function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last.current && y > 200);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const items = [
    ["Products", "#products"],
    ["Story", "#story"],
    ["Delivery", "#delivery"],
    ["Bulk", "#bulk"],
    ["Contact", "#contact"],
  ];
  return (
    <motion.header
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5"
    >
      <nav
        className={`flex items-center gap-2 rounded-full border transition-all duration-500 ${
          scrolled
            ? "border-white/60 bg-white/70 shadow-[0_10px_40px_-15px_rgba(30,86,49,0.35)] backdrop-blur-xl"
            : "border-white/25 bg-white/10 backdrop-blur-md"
        } px-3 py-2`}
      >
        <a href="#top" className="flex items-center gap-2 rounded-full px-4 py-1.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--forest-deep)] text-[var(--cream)]">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-[var(--forest-deep)]">
            Marinovate<span className="text-[var(--gold)]">.</span>
          </span>
        </a>
        <div className="mx-2 hidden h-6 w-px bg-black/10 md:block" />
        <ul className="hidden items-center gap-1 md:flex">
          {items.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                className="rounded-full px-4 py-1.5 text-sm text-[var(--ink)]/80 transition hover:bg-[var(--forest-deep)]/10 hover:text-[var(--forest-deep)]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#bulk"
          className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-[var(--forest-deep)] px-4 py-2 text-sm font-medium text-[var(--cream)] transition hover:bg-[var(--forest)]"
        >
          Bulk Quote <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </nav>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ */
/* Floating leaves                                                    */
/* ------------------------------------------------------------------ */
function FloatingLeaves() {
  const leaves = Array.from({ length: 9 });
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {leaves.map((_, i) => (
        <span
          key={i}
          className="absolute -top-10 text-[var(--forest)]/25"
          style={{
            left: `${(i * 11 + 5) % 100}%`,
            animation: `leaf-drift ${18 + (i % 5) * 4}s linear ${i * 2.3}s infinite`,
          }}
        >
          <Leaf className="h-5 w-5" />
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img
          src={heroImg}
          alt="Fresh premium vegetables and produce"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,15,0.35)_0%,rgba(10,20,15,0.55)_50%,rgba(10,20,15,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />

      <motion.div style={{ opacity }} className="relative z-10 flex h-full items-center px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 flex items-center gap-3 text-[var(--gold)]"
          >
            <span className="h-px w-10 bg-[var(--gold)]" />
            <span className="text-xs uppercase tracking-[0.4em]">Fresh from Nature</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(2.6rem,7vw,6.2rem)] font-medium leading-[0.98] tracking-tight text-white"
          >
            Premium Fresh Produce
            <br />
            <span className="italic text-white/90">Delivered Across </span>
            <span className="font-script text-[var(--gold)]" style={{ fontSize: "0.9em" }}>
              India
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="mt-8 max-w-2xl text-[17px] leading-relaxed text-white/75"
          >
            From farms and oceans to your business — fresh vegetables, fruits and seafood,
            delivered with quality, hygiene and trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="#products" className="btn-primary group">
              Explore Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#bulk" className="btn-ghost group">
              Bulk Orders
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 text-white/70"
          >
            {[
              ["12+", "Cities Served"],
              ["500+", "B2B Partners"],
              ["24h", "Farm to Door"],
              ["100%", "Quality Checked"],
            ].map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-2">
                <span className="font-display text-3xl text-[var(--gold)]">{n}</span>
                <span className="text-xs uppercase tracking-[0.25em]">{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="h-8 w-px bg-white/40"
        />
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section helpers                                                    */
/* ------------------------------------------------------------------ */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  eyebrow, script, title, subtitle, align = "center",
}: { eyebrow?: string; script?: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={`mx-auto max-w-3xl ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow && (
        <Reveal><p className="eyebrow mb-4">{eyebrow}</p></Reveal>
      )}
      {script && (
        <Reveal delay={0.05}>
          <p className="script-title mb-2">{script}</p>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-[var(--forest-deep)]">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="mt-5 text-base leading-relaxed text-[var(--ink)]/65">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Why Marinovate                                                     */
/* ------------------------------------------------------------------ */
function WhySection() {
  const items = [
    { icon: Leaf, title: "Farm Fresh", body: "Harvested at peak ripeness, on the field only hours before it reaches you." },
    { icon: ShieldCheck, title: "100% Quality Checked", body: "Multi-stage inspection for grade, freshness, and food-safety compliance." },
    { icon: Clock, title: "Timely Delivery", body: "Scheduled dispatch windows built for kitchens that run on the clock." },
    { icon: Boxes, title: "Bulk Supply", body: "Wholesale volumes for hotels, retail chains, exporters and institutions." },
    { icon: MapPin, title: "Pan India Delivery", body: "A cold-chain logistics network reaching cities across the country." },
    { icon: Package, title: "Hygienic Packaging", body: "Food-grade, tamper-evident packing that protects freshness in transit." },
    { icon: BadgeCheck, title: "Affordable Pricing", body: "Direct farm & fishery sourcing lets us offer premium quality, fairly priced." },
    { icon: Sparkles, title: "Trusted Partner", body: "Long-term supply relationships built on consistency and communication." },
  ];
  return (
    <section className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Why Marinovate"
          script="Pure by Nature"
          title="Eight promises we deliver every single day."
          subtitle="Everything we do is designed for chefs, retailers and businesses who cannot compromise on freshness."
        />
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 4) * 0.05}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full overflow-hidden rounded-[28px] border border-white bg-white/70 p-7 shadow-[0_20px_60px_-30px_rgba(30,86,49,0.35)] backdrop-blur-xl"
              >
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--fresh)]/15 blur-3xl transition-all duration-700 group-hover:bg-[var(--gold)]/25"
                />
                <div className="relative">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--forest-deep)] text-[var(--cream)] shadow-[var(--shadow-luxury)]">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl text-[var(--forest-deep)]">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/65">{it.body}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */
function ProductsSection() {
  const products = [
    {
      icon: Leaf, tag: "Vegetables", title: "Fresh Vegetables",
      body: "Leafy greens, roots, herbs, exotics — harvested daily and grade-sorted before it leaves the farm.",
      img: vegImg,
    },
    {
      icon: Apple, tag: "Fruits", title: "Fresh Fruits",
      body: "Seasonal Indian favourites and exotic imports, chosen at peak ripeness for flavour and shelf life.",
      img: fruitImg,
    },
    {
      icon: Fish, tag: "Seafood", title: "Fresh Seafood",
      body: "Direct from coastal fisheries — fish, prawns, mollusks — packed on ice in strict cold chain.",
      img: seaImg,
    },
  ];
  return (
    <section id="products" className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Our Products"
          script="Farm to Table"
          title="A curated pantry of the freshest India has to offer."
        />
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_60px_-30px_rgba(30,86,49,0.3)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/85 via-[var(--forest-deep)]/10 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    <p.icon className="h-3.5 w-3.5" /> {p.tag}
                  </div>
                  <div className="absolute inset-x-6 bottom-6 text-white">
                    <h3 className="font-display text-3xl leading-tight">{p.title}</h3>
                    <p className="mt-2 max-w-sm text-sm text-white/80">{p.body}</p>
                    <a
                      href="#contact"
                      className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--gold)] transition group-hover:gap-3"
                    >
                      Learn more <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Story                                                               */
/* ------------------------------------------------------------------ */
function StorySection() {
  const bullets = [
    ["Fresh sourcing", "Trusted farmer & fishery partners across India."],
    ["Quality control", "Multi-stage checks: grade, size, freshness, food safety."],
    ["Natural farming", "Preference for organic and low-input practices where possible."],
    ["Daily harvest", "Same-day dispatch from the field to reduce time-to-plate."],
    ["Fast transportation", "Refrigerated fleet and express logistics partners."],
    ["Cold chain", "Temperature-controlled at every step, right to your doorstep."],
  ];
  return (
    <section id="story" className="section-py relative overflow-hidden px-6 md:px-12">
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-[var(--fresh)]/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[var(--gold)]/20 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[36px] shadow-[var(--shadow-luxury)]">
              <img src={storyImg} alt="Golden hour farm" loading="lazy" className="h-[620px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/40 to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="glass absolute -bottom-8 -right-4 hidden max-w-xs rounded-3xl p-6 md:block"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--gold)] text-[var(--ink)]">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/60">Harvested</p>
                  <p className="font-display text-lg text-[var(--forest-deep)]">This morning</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--ink)]/70">Every crate is picked, checked and packed within a single sunrise window.</p>
            </motion.div>
          </div>
        </Reveal>

        <div>
          <p className="eyebrow mb-4">Our Story</p>
          <p className="script-title mb-3">Harvested with Love</p>
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] text-[var(--forest-deep)]">
              Six disciplines. One promise of freshness.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg text-[var(--ink)]/65">
              Marinovate Farms exists to shorten the distance between the farm, the fishery and your kitchen —
              without ever cutting corners on quality, hygiene or timing.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {bullets.map(([t, d], i) => (
              <Reveal key={t} delay={0.05 * i}>
                <div className="flex gap-4">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--forest-deep)]/20 bg-white text-[var(--forest-deep)]">
                    <Leaf className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-[var(--forest-deep)]">{t}</h4>
                    <p className="mt-1 text-sm text-[var(--ink)]/60">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Health benefits                                                     */
/* ------------------------------------------------------------------ */
function HealthSection() {
  const groups = [
    {
      icon: Leaf, title: "Fresh Vegetables", tint: "from-[var(--fresh)]/25 to-transparent",
      items: ["Rich in vitamins", "Dietary fiber", "Essential minerals", "Immune support"],
    },
    {
      icon: Apple, title: "Fresh Fruits", tint: "from-[var(--gold)]/25 to-transparent",
      items: ["Natural sugars", "Antioxidants", "Vitamin C", "Hydration"],
    },
    {
      icon: Fish, title: "Fresh Seafood", tint: "from-[var(--forest)]/25 to-transparent",
      items: ["High protein", "Omega-3", "Heart health", "Brain health"],
    },
  ];
  return (
    <section className="section-py relative overflow-hidden bg-[var(--forest-deep)] px-6 md:px-12 noise">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[var(--fresh)]/30 blur-[140px]" />
        <div className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-[var(--gold)]/25 blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--gold)]">
              <span className="h-px w-8 bg-[var(--gold)]" /> Health Benefits
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-script text-4xl text-[var(--gold)]">Nourish, Naturally</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] text-white">
              Food that tastes as good as it works for you.
            </h2>
          </Reveal>
        </div>
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.1}>
              <div className={`relative h-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br ${g.tint} p-8 backdrop-blur-xl`}>
                <div className="absolute inset-0 bg-white/[0.03]" />
                <div className="relative">
                  <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[var(--gold)] backdrop-blur">
                    <g.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl text-white">{g.title}</h3>
                  <ul className="mt-6 space-y-3">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-sm text-white/75">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How we work                                                         */
/* ------------------------------------------------------------------ */
function ProcessSection() {
  const steps = [
    { icon: Sun, t: "Harvest", d: "Sunrise picking at partner farms and fisheries." },
    { icon: Search, t: "Quality Inspection", d: "Grade, size, freshness and food safety." },
    { icon: Boxes, t: "Sorting", d: "Batched by product, size and destination." },
    { icon: Package, t: "Packing", d: "Food-grade, tamper-evident, hygienic packing." },
    { icon: Snowflake, t: "Cold Storage", d: "Temperature-controlled holding rooms." },
    { icon: Truck, t: "Transportation", d: "Refrigerated fleet + express partners." },
    { icon: Heart, t: "Delivered", d: "At your door — fresh, on time, every time." },
  ];
  return (
    <section className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="How We Work" script="Farm to Door" title="A seven-step ritual, refined every day." />
        <div className="relative mt-24">
          <div aria-hidden className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-[var(--forest-deep)]/25 to-transparent md:block" />
          <ol className="grid gap-10 md:grid-cols-7 md:gap-4">
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.06}>
                <li className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 grid h-[72px] w-[72px] place-items-center rounded-full border border-white bg-white shadow-[var(--shadow-luxury)]">
                    <s.icon className="h-6 w-6 text-[var(--forest-deep)]" />
                    <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-[var(--gold)] text-[10px] font-semibold text-[var(--ink)]">
                      {i + 1}
                    </span>
                  </div>
                  <h4 className="mt-5 font-display text-base text-[var(--forest-deep)]">{s.t}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ink)]/60">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Bulk Orders                                                         */
/* ------------------------------------------------------------------ */
function BulkSection() {
  const audiences = ["Hotels", "Restaurants", "Corporate Kitchens", "Retail Stores", "Export", "Wholesalers"];
  return (
    <section id="bulk" className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[40px] bg-[var(--forest-deep)] p-10 md:p-20 noise">
            <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[var(--gold)]/20 blur-[120px]" />
            <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[var(--fresh)]/20 blur-[120px]" />
            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--gold)]">
                  <span className="h-px w-8 bg-[var(--gold)]" /> Bulk Orders
                </p>
                <p className="font-script text-4xl text-[var(--gold)]">At Any Scale</p>
                <h2 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] text-white">
                  Wholesale-grade freshness for businesses that never sleep.
                </h2>
                <p className="mt-6 max-w-lg text-white/70">
                  Whether you're plating for guests, stocking shelves, or preparing an export container —
                  our sourcing and cold chain scale with your operation.
                </p>
                <a href="#contact" className="btn-primary mt-10 group">
                  Request Bulk Quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {audiences.map((a) => (
                  <div key={a} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 text-white backdrop-blur-md transition hover:border-[var(--gold)]/60 hover:bg-white/[0.1]">
                    <div className="flex items-center gap-2 text-[var(--gold)]">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-[10px] uppercase tracking-[0.28em]">Supplied for</span>
                    </div>
                    <p className="mt-3 font-display text-xl">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* India Delivery                                                      */
/* ------------------------------------------------------------------ */
function DeliverySection() {
  const pins = [
    { x: 34, y: 30, label: "Delhi" },
    { x: 30, y: 50, label: "Mumbai" },
    { x: 55, y: 68, label: "Hyderabad" },
    { x: 42, y: 82, label: "Bengaluru" },
    { x: 60, y: 82, label: "Chennai" },
    { x: 74, y: 44, label: "Kolkata" },
    { x: 46, y: 42, label: "Ahmedabad" },
    { x: 52, y: 24, label: "Chandigarh" },
  ];
  return (
    <section id="delivery" className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Pan India Delivery" script="Wherever You Are" title="One cold chain. Every corner of India." />
        <Reveal delay={0.1}>
          <div className="relative mt-16 overflow-hidden rounded-[36px] border border-white/60 bg-white/60 p-8 shadow-[var(--shadow-luxury)] backdrop-blur-xl">
            <div className="relative mx-auto aspect-[4/5] max-w-xl">
              {/* Stylised India silhouette */}
              <svg viewBox="0 0 400 500" className="absolute inset-0 h-full w-full text-[var(--forest-deep)]/15" fill="currentColor">
                <path d="M180 40 C 220 30, 260 45, 280 70 C 310 90, 320 120, 315 155 C 330 175, 340 200, 330 235 C 345 260, 355 300, 335 340 C 320 370, 300 395, 270 415 C 240 440, 210 465, 195 480 C 180 460, 170 435, 160 410 C 140 395, 115 375, 100 340 C 85 305, 80 265, 95 230 C 80 205, 75 175, 90 145 C 105 115, 130 90, 150 70 C 160 55, 170 45, 180 40 Z" />
              </svg>
              {pins.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span className="absolute -inset-3 animate-ping rounded-full bg-[var(--fresh)]/40" />
                  <span className="relative grid h-6 w-6 place-items-center rounded-full bg-[var(--forest-deep)] text-white shadow-[var(--shadow-luxury)]">
                    <MapPin className="h-3 w-3" />
                  </span>
                  <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--forest-deep)] shadow">
                    {p.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Truck, t: "Refrigerated Fleet", d: "Purpose-built cold-chain vehicles." },
                { icon: Snowflake, t: "Cold Chain", d: "Temperature-controlled every mile." },
                { icon: Clock, t: "Express Windows", d: "24–48h door delivery in tier-1 cities." },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--forest-deep)] text-[var(--cream)]">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base text-[var(--forest-deep)]">{f.t}</h4>
                    <p className="mt-1 text-sm text-[var(--ink)]/60">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */
function Testimonials() {
  const t = [
    { name: "Arjun Menon", role: "Executive Chef, Coastal Kitchen", body: "The seafood arrives with the polish of an in-house sourcing team. Consistent quality, week after week." },
    { name: "Priya Reddy", role: "Purchasing Head, Grand Retreat Hotels", body: "Marinovate has redefined our produce standards. Even at scale, freshness never dips." },
    { name: "Vikram Shah", role: "Founder, Green Basket Retail", body: "Their cold chain is exceptional. Our shrinkage dropped and customer feedback shot up." },
    { name: "Neha Kapoor", role: "Head of Ops, CloudMeals", body: "Reliable timing is our lifeline. Marinovate delivers on the minute — and on the mark." },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % t.length), 6000);
    return () => clearInterval(id);
  }, [t.length]);
  return (
    <section className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Testimonials" script="Trusted Voices" title="What our partners say." />
        <div className="relative mt-16 h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass absolute inset-0 flex flex-col items-center justify-center rounded-[32px] p-10 text-center"
            >
              <div className="mb-5 flex gap-1 text-[var(--gold)]">
                {[0, 1, 2, 3, 4].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="max-w-2xl font-display text-2xl italic leading-relaxed text-[var(--forest-deep)] md:text-3xl">
                “{t[i].body}”
              </p>
              <div className="mt-8">
                <p className="font-display text-lg text-[var(--forest-deep)]">{t[i].name}</p>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--ink)]/50">{t[i].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {t.map((_, n) => (
            <button
              key={n}
              aria-label={`Testimonial ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-[var(--forest-deep)]" : "w-2 bg-[var(--forest-deep)]/25"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                              */
/* ------------------------------------------------------------------ */
function Gallery() {
  const items = [
    { src: vegImg, span: "row-span-2" },
    { src: fruitImg, span: "" },
    { src: seaImg, span: "" },
    { src: storyImg, span: "col-span-2" },
    { src: heroImg, span: "" },
    { src: vegImg, span: "" },
  ];
  return (
    <section className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Gallery" script="Moments of Freshness" title="A glimpse inside our farms & fisheries." />
        <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05}>
              <div className={`group relative h-full overflow-hidden rounded-[24px] ${it.span}`}>
                <img
                  src={it.src}
                  loading="lazy"
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/60 to-transparent opacity-60 transition group-hover:opacity-80" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */
function FAQ() {
  const faqs = [
    { q: "Which cities do you deliver to across India?", a: "We deliver to major metros and tier-1 cities with an expanding cold-chain footprint. Reach out with your location and we'll confirm serviceability and lead time." },
    { q: "Do you accept bulk orders for hotels and retail chains?", a: "Yes — bulk supply is our specialty. We work with hotels, restaurants, corporate kitchens, retail chains, exporters and wholesalers on custom SKU lists and delivery schedules." },
    { q: "How do you ensure freshness during transit?", a: "Every consignment travels through a temperature-controlled cold chain: refrigerated storage, insulated packaging, and refrigerated fleet or express cold logistics partners." },
    { q: "Is your seafood export-quality?", a: "Absolutely. Our seafood is sourced directly from coastal fisheries, graded, ice-packed and moved through strict cold chain — with export-grade options available on request." },
    { q: "What is the minimum order quantity?", a: "MOQs depend on product and destination city. Share your requirement and we'll build a quote around your volume and cadence." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions." />
        <div className="mt-14 space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="glass overflow-hidden rounded-[24px]">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-left"
                >
                  <span className="font-display text-lg text-[var(--forest-deep)]">{f.q}</span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--forest-deep)] text-white transition-transform ${open === i ? "rotate-180" : ""}`}>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[var(--ink)]/70">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                              */
/* ------------------------------------------------------------------ */
function Contact() {
  return (
    <section id="contact" className="section-py relative px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Contact" script="Let's Talk" title="Fresh conversations start here." />
        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <Reveal>
            <div className="glass h-full rounded-[32px] p-8 lg:col-span-2">
              <h3 className="font-display text-2xl text-[var(--forest-deep)]">Get in touch</h3>
              <p className="mt-2 text-sm text-[var(--ink)]/65">
                We respond to enquiries within one business day.
              </p>
              <div className="mt-8 space-y-6 text-sm">
                <a href="tel:8019794244" className="flex items-start gap-4 group">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--forest-deep)] text-[var(--cream)]"><Phone className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/50">Phone</p>
                    <p className="mt-1 font-display text-lg text-[var(--forest-deep)] group-hover:text-[var(--fresh)]">+91 80197 94244</p>
                  </div>
                </a>
                <a href="mailto:marinovatefarms@gmail.com" className="flex items-start gap-4 group">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--forest-deep)] text-[var(--cream)]"><Mail className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/50">Email</p>
                    <p className="mt-1 font-display text-lg text-[var(--forest-deep)] group-hover:text-[var(--fresh)] break-all">marinovatefarms@gmail.com</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--forest-deep)] text-[var(--cream)]"><MapPin className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/50">Address</p>
                    <p className="mt-1 text-[var(--ink)]/80 leading-relaxed">
                      Flat No. 201, 2nd Floor, Door No. 1-95/40,<br />
                      Rajiv Nagar, Venkateshwara Colony,<br />
                      Uppal, Hyderabad – 500039
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--forest-deep)] text-[var(--cream)]"><Clock className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/50">Hours</p>
                    <p className="mt-1 text-[var(--ink)]/80 leading-relaxed">
                      Mon – Sat &nbsp; 10:00 AM – 6:00 PM<br />
                      Sun &nbsp; Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Thank you — we will be in touch soon."); }}
              className="glass rounded-[32px] p-8 lg:col-span-3"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" />
                <Field label="Company" name="company" />
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" />
                <div className="sm:col-span-2">
                  <Field label="Product interest" name="interest" placeholder="Vegetables, Fruits, Seafood, Bulk…" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Message" name="message" as="textarea" />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-8 group w-full sm:w-auto">
                Send Enquiry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 overflow-hidden rounded-[32px] border border-white/60 shadow-[var(--shadow-luxury)]">
            <iframe
              title="Marinovate Farms location"
              src="https://www.google.com/maps?q=Uppal,+Hyderabad,+500039&output=embed"
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", as, placeholder, required,
}: { label: string; name: string; type?: string; as?: "textarea"; placeholder?: string; required?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const active = focused || value.length > 0;
  const shared =
    "peer w-full rounded-2xl border border-white/70 bg-white/60 px-5 pt-6 pb-2 text-sm text-[var(--ink)] outline-none transition-all focus:border-[var(--forest-deep)] focus:bg-white";
  return (
    <label className="relative block">
      <span
        className={`pointer-events-none absolute left-5 z-10 transition-all duration-300 ${
          active
            ? "top-2 text-[10px] uppercase tracking-[0.22em] text-[var(--forest-deep)]"
            : "top-1/2 -translate-y-1/2 text-sm text-[var(--ink)]/50"
        }`}
      >
        {label}
      </span>
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={5}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          className={shared}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          className={shared}
        />
      )}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--forest-deep)] px-6 py-16 text-white/80 md:px-12 noise">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-[var(--fresh)]/20 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gold)] text-[var(--ink)]"><Leaf className="h-4 w-4" /></span>
              <span className="font-display text-2xl text-white">Marinovate<span className="text-[var(--gold)]">.</span></span>
            </div>
            <p className="mt-6 max-w-md text-sm text-white/60">
              <span className="font-script text-2xl text-[var(--gold)]">Fresh from Nature.</span>{" "}
              Delivered across India. Premium vegetables, fruits and seafood — sourced daily, packed hygienically, shipped fast.
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">Quick Links</p>
            <ul className="mt-5 space-y-2 text-sm">
              {[["Products", "#products"], ["Story", "#story"], ["Delivery", "#delivery"], ["Bulk Orders", "#bulk"], ["Contact", "#contact"]].map(([l, h]) => (
                <li key={h}><a href={h} className="transition hover:text-[var(--gold)]">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">Business Hours</p>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              <li>Mon – Sat · 10:00 AM – 6:00 PM</li>
              <li>Sun · Closed</li>
            </ul>
            <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">Reach us</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><a href="tel:8019794244" className="hover:text-[var(--gold)]">+91 80197 94244</a></li>
              <li className="break-all"><a href="mailto:marinovatefarms@gmail.com" className="hover:text-[var(--gold)]">marinovatefarms@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Marinovate Farms. All rights reserved.</p>
          <p>Crafted with care in Hyderabad, India.</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Progress bar + cursor glow                                          */
/* ------------------------------------------------------------------ */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[var(--fresh)] via-[var(--gold)] to-[var(--forest-deep)]"
    />
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] hidden md:block"
      style={{
        background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, oklch(0.78 0.13 85 / 0.08), transparent 60%)`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export function MarinovateHome() {
  return (
    <div className="relative overflow-x-clip">
      <ProgressBar />
      <CursorGlow />
      <FloatingLeaves />
      <Nav />
      <main>
        <Hero />
        <WhySection />
        <ProductsSection />
        <StorySection />
        <HealthSection />
        <ProcessSection />
        <BulkSection />
        <DeliverySection />
        <Testimonials />
        <Gallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { Header, Footer } from "@/components/molecules";
import { AuthModal } from "@/components/AuthModal";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import {
  Check,
  Zap,
  Infinity,
  Clock,
  Mail,
  Figma,
  MonitorSmartphone,
  ArrowRight,
  Star,
  TrendingDown,
  Search,
  BookOpen,
  Timer,
} from "lucide-react";
import clsx from "clsx";

// ─── Pricing data ────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "yearly",
    name: "Yearly",
    tagline: "Best for active designers",
    badge: "🔥 May Deal",
    badgeColor: "bg-orange-100 text-orange-600",
    price: 15,
    originalPrice: 50,
    unit: "/ month",
    billed: "Billed annually — $180 / year",
    savings: "Save 70%",
    cta: "Start Yearly Plan",
    ctaStyle: "border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white",
    highlight: false,
    limitedTime: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    tagline: "Pay once, own it forever",
    badge: "⚡ Best Value",
    badgeColor: "bg-purple-100 text-purple-700",
    price: 80,
    originalPrice: null,
    unit: "one-time",
    billed: "Never pay again. All future updates included.",
    savings: null,
    cta: "Get Lifetime Access",
    ctaStyle: "bg-purple-600 text-white hover:bg-purple-700",
    highlight: true,
    limitedTime: false,
  },
];

const FEATURES = [
  {
    icon: MonitorSmartphone,
    title: "Request 2 App Screens with Full Flow",
    description:
      "Can't find a specific screen? Request up to 2 app flows per month — complete with navigation context. Free apps are processed right away; paid apps go through a quick internal review first.",
  },
  {
    icon: Figma,
    title: "Access to Paid Figma Plugins",
    description:
      "Unlock curated premium Figma plugins we've vetted for UI research workflows — no extra plugin subscriptions needed.",
  },
  {
    icon: Mail,
    title: "Weekly Best App Digest",
    description:
      "Every Monday, the most design-worthy apps land in your inbox — selected by our team so you never miss a standout UI.",
  },
];

const COMPARISONS = [
  {
    icon: Search,
    label: "Find apps manually",
    cost: "Hours each week",
    highlight: false,
  },
  {
    icon: BookOpen,
    label: "Buy design courses",
    cost: "$200–$800/yr",
    highlight: false,
  },
  {
    icon: Figma,
    label: "Individual Figma plugins",
    cost: "$100–$300/yr",
    highlight: false,
  },
  {
    icon: Timer,
    label: "UXBoard Yearly",
    cost: "$15/mo (May only)",
    highlight: true,
  },
];

const FAQS = [
  {
    q: "What counts as a 'free' app for screen requests?",
    a: "Any app that's freely downloadable on the App Store or Google Play without a paywall or subscription requirement. Paid or premium apps go through a brief internal review before we fulfill the request.",
  },
  {
    q: "Can I switch from Yearly to Lifetime later?",
    a: "Yes — just get in touch with us and we'll sort it out. If you're currently on a yearly plan, any unused months are taken into account.",
  },
  {
    q: "What Figma plugins are included?",
    a: "We add plugins to the library regularly. Current selections focus on UI inspiration, asset management, and component analysis. You'll be notified whenever new plugins are added.",
  },
  {
    q: "Is the $15/month pricing permanent?",
    a: "No — this is a May launch special. After May 31, the yearly plan returns to its standard price. Lock it in now to keep the discounted rate for the entire year.",
  },
  {
    q: "Do I need to enter a credit card to try?",
    a: "Browsing UXBoard is always free. You only need to pay when you choose to upgrade to a plan.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: i * 0.08,
    },
  }),
};

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#EBEBEB] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="font-secondary font-semibold text-[15px] text-[#111] leading-[1.5]">
          {q}
        </span>
        <span
          className={clsx(
            "shrink-0 w-5 h-5 rounded-full border-2 border-[#DCDCDC] flex items-center justify-center mt-0.5 transition-transform",
            open && "rotate-45 border-purple-500"
          )}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={clsx("transition-colors", open ? "stroke-purple-500" : "stroke-[#999]")}
          >
            <line x1="5" y1="0" x2="5" y2="10" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="5" x2="10" y2="5" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="font-secondary text-[14px] text-[#666] leading-[1.75] pb-5">
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
const PricingPage: React.FC = () => {
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const user = useTypedSelector((state: RootState) => state.auth.user);

  const handleCTA = () => {
    if (!user) {
      setIsOpenAuth(true);
    } else {
      window.location.href = "/subscription";
    }
  };

  return (
    <>
      <SEO
        title="Pricing – UXBoard"
        description="Unlock full access to UXBoard. One low price for the world's best mobile UI reference library, Figma plugin access, and weekly design inspiration."
        keywords="UXBoard pricing, UI design subscription, Figma plugins, app screen reference"
      />

      <Header scrolled={false} transparentBg={true} onOpenAuthModal={() => setIsOpenAuth(true)} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0C0C0C] pt-[130px] pb-20 relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[780px] text-center flex flex-col items-center gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/50 font-secondary text-[12px] font-medium tracking-wide"
            >
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              May Launch Special — Ends May 31
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="font-secondary font-extrabold text-[42px] md:text-[60px] text-white leading-[1.04] tracking-tight"
            >
              Stop Hunting.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                Start Designing.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="font-secondary text-[16px] md:text-[18px] text-white/45 max-w-[560px] leading-[1.65]"
            >
              One subscription replaces hours of manual research, expensive Figma plugins,
              and scattered inspiration folders — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="flex items-center gap-3 mt-2"
            >
              <button
                onClick={handleCTA}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-secondary font-semibold text-[15px] transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/"
                className="font-secondary text-[14px] text-white/40 hover:text-white/70 transition-colors"
              >
                Browse for free →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ────────────────────────────────────────────────── */}
      <section className="w-full bg-[#F7F7F7] py-20">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[860px] flex flex-col items-center gap-10">
            <div className="text-center">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-[#AEAEB2] mb-3">
                Plans
              </p>
              <h2 className="font-secondary font-extrabold text-[32px] md:text-[40px] text-[#0F0F0F] leading-[1.1]">
                Simple, transparent pricing
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={clsx(
                    "relative flex flex-col rounded-[24px] border overflow-hidden",
                    plan.highlight
                      ? "bg-[#0C0C0C] border-purple-600 shadow-[0_0_0_1px_rgba(147,51,234,0.4),0_24px_60px_rgba(147,51,234,0.15)]"
                      : "bg-white border-[#E8E8E8] shadow-sm"
                  )}
                >
                  {/* Recommended ribbon */}
                  {plan.highlight && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
                  )}

                  <div className="p-8 flex flex-col gap-6 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={clsx(
                            "inline-block px-2.5 py-0.5 rounded-full font-secondary text-[11px] font-bold tracking-wide mb-3",
                            plan.highlight
                              ? "bg-purple-900/60 text-purple-300"
                              : plan.badgeColor
                          )}
                        >
                          {plan.badge}
                        </span>
                        <h3
                          className={clsx(
                            "font-secondary font-extrabold text-[26px] leading-none",
                            plan.highlight ? "text-white" : "text-[#0F0F0F]"
                          )}
                        >
                          {plan.name}
                        </h3>
                        <p
                          className={clsx(
                            "font-secondary text-[13px] mt-1.5",
                            plan.highlight ? "text-white/40" : "text-[#AEAEB2]"
                          )}
                        >
                          {plan.tagline}
                        </p>
                      </div>

                      {plan.highlight ? (
                        <Infinity className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
                      ) : (
                        <Zap className="w-8 h-8 text-orange-400 shrink-0 mt-1" />
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        {plan.originalPrice && (
                          <span
                            className={clsx(
                              "font-secondary text-[18px] line-through",
                              plan.highlight ? "text-white/25" : "text-[#CCC]"
                            )}
                          >
                            ${plan.originalPrice}
                          </span>
                        )}
                        <span
                          className={clsx(
                            "font-secondary font-extrabold text-[48px] leading-none tracking-tight",
                            plan.highlight ? "text-white" : "text-[#0F0F0F]"
                          )}
                        >
                          ${plan.price}
                        </span>
                        <span
                          className={clsx(
                            "font-secondary text-[15px] mb-1",
                            plan.highlight ? "text-white/40" : "text-[#AEAEB2]"
                          )}
                        >
                          {plan.unit}
                        </span>
                        {plan.savings && (
                          <span className="ml-1 mb-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-secondary font-bold text-[11px]">
                            <TrendingDown className="w-3 h-3" />
                            {plan.savings}
                          </span>
                        )}
                      </div>
                      <p
                        className={clsx(
                          "font-secondary text-[12px]",
                          plan.highlight ? "text-white/30" : "text-[#AEAEB2]"
                        )}
                      >
                        {plan.billed}
                      </p>
                      {plan.limitedTime && (
                        <p className="font-secondary text-[11px] font-semibold text-orange-500 mt-0.5">
                          ⏰ This price is only available in May
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-3">
                      {[
                        "2 app screen requests / month with full flow",
                        "Free app requests processed immediately",
                        "Access to paid Figma plugin library",
                        "Weekly best app digest to your inbox",
                        "All future updates & new features",
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check
                            className={clsx(
                              "w-4 h-4 shrink-0 mt-0.5",
                              plan.highlight ? "text-purple-400" : "text-purple-600"
                            )}
                          />
                          <span
                            className={clsx(
                              "font-secondary text-[13px] leading-[1.55]",
                              plan.highlight ? "text-white/70" : "text-[#444]"
                            )}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto pt-2">
                      <button
                        onClick={handleCTA}
                        className={clsx(
                          "w-full py-3.5 rounded-full font-secondary font-bold text-[14px] transition-colors",
                          plan.ctaStyle
                        )}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="font-secondary text-[13px] text-[#AEAEB2] text-center">
              All plans include full access to UXBoard's app library. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* ── What you get ─────────────────────────────────────────────────── */}
      <section className="w-full bg-white py-20">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[860px] flex flex-col gap-12">
            <div className="text-center">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-[#AEAEB2] mb-3">
                What's included
              </p>
              <h2 className="font-secondary font-extrabold text-[32px] md:text-[40px] text-[#0F0F0F] leading-[1.1]">
                Everything a designer needs to ship faster
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-col gap-4 p-6 rounded-[18px] border border-[#EBEBEB] bg-[#F9F9F9]"
                  >
                    <div className="w-10 h-10 rounded-[10px] bg-purple-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-secondary font-bold text-[15px] text-[#0F0F0F] leading-[1.35]">
                        {f.title}
                      </h3>
                      <p className="font-secondary text-[13px] text-[#777] leading-[1.7]">
                        {f.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cost comparison ──────────────────────────────────────────────── */}
      <section className="w-full bg-[#0C0C0C] py-20">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[780px] flex flex-col gap-12">
            <div className="text-center">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-white/25 mb-3">
                The math is clear
              </p>
              <h2 className="font-secondary font-extrabold text-[32px] md:text-[40px] text-white leading-[1.1]">
                Why pay more to do it the hard way?
              </h2>
              <p className="font-secondary text-[15px] text-white/40 mt-4 max-w-[520px] mx-auto leading-[1.65]">
                Most designers spend hours each week hunting for the right reference,
                buying plugins one by one, and subscribing to newsletters that barely deliver.
                UXBoard cuts through all of that.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {COMPARISONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className={clsx(
                      "flex items-center justify-between gap-4 px-5 py-4 rounded-[14px] border",
                      item.highlight
                        ? "bg-purple-600/10 border-purple-500/40"
                        : "bg-white/[0.04] border-white/[0.07]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          item.highlight ? "bg-purple-500/20" : "bg-white/[0.06]"
                        )}
                      >
                        <Icon
                          className={clsx(
                            "w-4 h-4",
                            item.highlight ? "text-purple-300" : "text-white/30"
                          )}
                        />
                      </div>
                      <span
                        className={clsx(
                          "font-secondary text-[14px] font-medium",
                          item.highlight ? "text-purple-200" : "text-white/50"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={clsx(
                        "font-secondary text-[14px] font-bold shrink-0",
                        item.highlight ? "text-purple-300" : "text-white/35"
                      )}
                    >
                      {item.cost}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-2 text-center pt-2">
              <p className="font-secondary text-[13px] text-white/30">
                At $15/month you're getting all three — for less than a single Figma plugin subscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof ─────────────────────────────────────────────────── */}
      <section className="w-full bg-white py-20">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[860px] flex flex-col gap-10">
            <div className="text-center">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-[#AEAEB2] mb-3">
                Designers love it
              </p>
              <h2 className="font-secondary font-extrabold text-[30px] md:text-[38px] text-[#0F0F0F] leading-[1.1]">
                What our members say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  quote:
                    "I used to spend Sundays scrolling through apps just to find a reference. Now I open UXBoard and it's all there.",
                  name: "Nadia R.",
                  role: "Product Designer",
                },
                {
                  quote:
                    "The Figma plugin access alone is worth it. I was paying $40/month for tools that are now included.",
                  name: "Bram K.",
                  role: "UI Designer, Startup",
                },
                {
                  quote:
                    "The weekly digest is my Monday morning ritual. Consistently the best-curated design content I get.",
                  name: "Tira M.",
                  role: "Senior UX Designer",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-4 p-6 rounded-[18px] border border-[#EBEBEB] bg-[#F9F9F9]"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="font-secondary text-[13px] text-[#555] leading-[1.75] italic flex-1">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="font-secondary font-bold text-[13px] text-[#0F0F0F]">{t.name}</p>
                    <p className="font-secondary text-[12px] text-[#AEAEB2]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#F7F7F7] py-20">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[700px] flex flex-col gap-10">
            <div className="text-center">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-[#AEAEB2] mb-3">
                Questions
              </p>
              <h2 className="font-secondary font-extrabold text-[30px] md:text-[38px] text-[#0F0F0F] leading-[1.1]">
                Frequently asked
              </h2>
            </div>

            <div className="bg-white rounded-[20px] border border-[#EBEBEB] px-6 divide-y divide-[#F0F0F0]">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#0C0C0C] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[640px] flex flex-col items-center text-center gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-secondary font-extrabold text-[36px] md:text-[48px] text-white leading-[1.08] tracking-tight"
            >
              Your next great design starts with the right reference.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-secondary text-[15px] text-white/40 leading-[1.7]"
            >
              Lock in the May price before it's gone. Upgrade, downgrade, or cancel anytime.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="flex flex-col sm:flex-row items-center gap-3 mt-2"
            >
              <button
                onClick={handleCTA}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-secondary font-bold text-[15px] transition-colors"
              >
                Get Started — $15 / month
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleCTA}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 hover:border-white/30 text-white/60 hover:text-white font-secondary font-semibold text-[15px] transition-colors"
              >
                Lifetime — $80
              </button>
            </motion.div>
            <p className="font-secondary text-[12px] text-white/25">
              Yearly price valid for new subscribers in May 2026 only.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        initialMode="login"
        isOpen={isOpenAuth}
        onClose={() => setIsOpenAuth(false)}
      />
    </>
  );
};

export default PricingPage;

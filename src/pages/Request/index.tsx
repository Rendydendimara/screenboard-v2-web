import React, { useState } from "react";
import SEO from "@/components/SEO";
import { AuthModal } from "@/components/AuthModal";
import { Header, Footer } from "@/components/molecules";
import { motion } from "framer-motion";
import { Send, Clock, CheckCircle2, ArrowRight } from "lucide-react";

const GOOGLE_FORM_URL = "https://forms.gle/Mi4GsDznBocUdrMz8";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const RequestPage: React.FC = () => {
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  const steps = [
    {
      icon: Send,
      step: "01",
      title: "Fill in the form",
      desc: "Tell us the app name, a public link, your role, and why you'd love to see it on UXBoard.",
    },
    {
      icon: Clock,
      step: "02",
      title: "We review it",
      desc: "Our team evaluates each request and prioritises based on demand, quality, and relevance.",
    },
    {
      icon: CheckCircle2,
      step: "03",
      title: "Screens go live",
      desc: "Once approved, we curate the app's best screens and publish them to the library — usually within a few days.",
    },
  ];

  return (
    <>
      <SEO
        title="Request App Screenshots – UXBoard"
        description="Can't find the app you're looking for? Submit a request and our team will curate its best screens and add them to UXBoard."
        keywords="request app screenshots, suggest app, UXBoard request, mobile app UI request, add app to UXBoard"
      />

      <Header
        scrolled={false}
        transparentBg={true}
        onOpenAuthModal={() => setIsOpenAuth(true)}
      />

      {/* ── Hero ── */}
      <section className="relative w-full bg-[#0C0C0C] pt-[140px] pb-24 overflow-hidden">
        {/* ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/12 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-600/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full flex justify-center px-4 md:px-0 relative">
          <div className="w-full max-w-[860px] text-center flex flex-col items-center gap-6">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-400/25 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-300">
                Community Requests
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="font-secondary font-extrabold text-[44px] md:text-[68px] text-white leading-[1.0]"
            >
              Don&apos;t see your app?
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                We&apos;ll add it.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="font-secondary text-[16px] text-white/50 max-w-[520px] leading-[1.8]"
            >
              Request any mobile app and our team will curate its best UI screens — for free. Already used by hundreds of designers and PMs.
            </motion.p>

            <motion.a
              {...fadeUp(0.24)}
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-14 px-9 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-secondary font-bold text-[15px] shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 hover:scale-[1.03] transition-all duration-200"
            >
              <Send className="w-4 h-4" />
              Submit a Request
            </motion.a>

            <motion.p {...fadeUp(0.3)} className="font-secondary text-[12px] text-white/25">
              Free &middot; No account required &middot; Typically reviewed within 3 business days
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <div className="w-full bg-[#111] border-t border-white/[0.06] py-20">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[1100px] flex flex-col gap-14">
            <div className="text-center flex flex-col gap-2">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30">
                How It Works
              </p>
              <h2 className="font-secondary font-extrabold text-[30px] text-white">
                Three simple steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {steps.map(({ icon: Icon, step, title, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-5 p-7 rounded-[24px] bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-[14px] bg-purple-500/20 border border-purple-400/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="font-secondary font-extrabold text-[32px] text-purple-400/40 leading-none select-none">
                      {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-secondary font-bold text-[17px] text-white mb-2">
                      {title}
                    </h3>
                    <p className="font-secondary text-[13px] text-white/40 leading-[1.7]">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white text-[#0C0C0C] font-secondary font-bold text-[14px] hover:bg-white/90 transition-all"
              >
                Open Request Form
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ-style facts ── */}
      <div className="w-full bg-[#0C0C0C] border-t border-white/[0.05] py-16">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[700px] flex flex-col gap-5">
            <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-white/25 text-center mb-2">
              Good to know
            </p>
            {[
              {
                q: "Which apps can I request?",
                a: "Any publicly available mobile app on iOS or Android. We prioritise apps with rich UI patterns — onboarding, dashboards, checkout flows, etc.",
              },
              {
                q: "How long does it take?",
                a: "Most requests are reviewed within 3 business days. Popular or high-demand apps are prioritised faster.",
              },
              {
                q: "Do I need an account?",
                a: "No account is needed to submit a request. Anyone can submit via the form link.",
              },
              {
                q: "Will I be notified when it's added?",
                a: "We're working on notification features. For now, you can search for the app on UXBoard after a few days.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="flex flex-col gap-1.5 p-5 rounded-[16px] border border-white/[0.07]">
                <p className="font-secondary font-semibold text-[14px] text-white">{q}</p>
                <p className="font-secondary text-[13px] text-white/45 leading-[1.65]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal isOpen={isOpenAuth} onClose={() => setIsOpenAuth(false)} />
      <Footer />
    </>
  );
};

export default RequestPage;

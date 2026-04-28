import React, { useState } from "react";
import SEO from "@/components/SEO";
import { AuthModal } from "@/components/AuthModal";
import { Header, Footer } from "@/components/molecules";

const ContactUsPage: React.FC = () => {
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  return (
    <>
      <SEO
        title="Contact Us – UXBoard"
        description="Get in touch with the UXBoard team. We'd love to hear from you."
        keywords="UXBoard contact, support, feedback, get in touch"
      />

      <Header
        scrolled={false}
        transparentBg={true}
        onOpenAuthModal={() => setIsOpenAuth(true)}
      />

      {/* Hero */}
      <section className="w-full bg-[#0C0C0C] pt-[130px] pb-16">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[860px]">
            <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30 mb-3">
              Support
            </p>
            <h1 className="font-secondary font-extrabold text-[42px] md:text-[56px] text-white leading-[1.05] mb-4">
              Contact Us
            </h1>
            <p className="font-secondary text-[14px] text-white/35">
              Have a question, feedback, or just want to say hi? We're here.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="w-full bg-white py-16">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[860px] flex flex-col gap-10">

            {/* Contact cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* General inquiries */}
              <div className="flex flex-col gap-3 p-6 rounded-[16px] border border-[#EBEBEB] bg-[#F8F8F8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <p className="font-secondary font-semibold text-[14px] text-[#0F0F0F]">
                    General Inquiries
                  </p>
                </div>
                <p className="font-secondary text-[13px] text-[#777] leading-[1.7]">
                  Questions about UXBoard, feature requests, or general feedback.
                </p>
                <a
                  href="mailto:hello@uxboard.art"
                  className="font-secondary text-[14px] font-medium text-purple-600 hover:underline"
                >
                  hello@uxboard.art
                </a>
              </div>

              {/* Support */}
              <div className="flex flex-col gap-3 p-6 rounded-[16px] border border-[#EBEBEB] bg-[#F8F8F8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <p className="font-secondary font-semibold text-[14px] text-[#0F0F0F]">
                    Account &amp; Billing Support
                  </p>
                </div>
                <p className="font-secondary text-[13px] text-[#777] leading-[1.7]">
                  Issues with your subscription, payments, or account access.
                </p>
                <a
                  href="mailto:support@uxboard.art"
                  className="font-secondary text-[14px] font-medium text-purple-600 hover:underline"
                >
                  support@uxboard.art
                </a>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-3 p-6 rounded-[16px] border border-[#EBEBEB] bg-[#F8F8F8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <p className="font-secondary font-semibold text-[14px] text-[#0F0F0F]">
                    Legal &amp; Content Removal
                  </p>
                </div>
                <p className="font-secondary text-[13px] text-[#777] leading-[1.7]">
                  DMCA takedown requests, copyright concerns, or legal matters.
                </p>
                <a
                  href="mailto:legal@uxboard.art"
                  className="font-secondary text-[14px] font-medium text-purple-600 hover:underline"
                >
                  legal@uxboard.art
                </a>
              </div>

              {/* Partnership */}
              <div className="flex flex-col gap-3 p-6 rounded-[16px] border border-[#EBEBEB] bg-[#F8F8F8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p className="font-secondary font-semibold text-[14px] text-[#0F0F0F]">
                    Partnerships &amp; Press
                  </p>
                </div>
                <p className="font-secondary text-[13px] text-[#777] leading-[1.7]">
                  Collaboration opportunities, media inquiries, or sponsorships.
                </p>
                <a
                  href="mailto:hello@uxboard.art"
                  className="font-secondary text-[14px] font-medium text-purple-600 hover:underline"
                >
                  hello@uxboard.art
                </a>
              </div>
            </div>

            <div className="w-full h-px bg-[#F0F0F0]" />

            {/* Response time */}
            <div className="flex flex-col gap-2">
              <h2 className="font-secondary font-bold text-[18px] text-[#0F0F0F]">
                Response Time
              </h2>
              <p className="font-secondary text-[15px] text-[#555] leading-[1.8]">
                We typically respond within <strong className="text-[#0F0F0F]">1–2 business days</strong>. For urgent issues related to billing or account access, please mention "Urgent" in your email subject line.
              </p>
            </div>

          </div>
        </div>
      </div>

      <AuthModal isOpen={isOpenAuth} onClose={() => setIsOpenAuth(false)} />
      <Footer />
    </>
  );
};

export default ContactUsPage;

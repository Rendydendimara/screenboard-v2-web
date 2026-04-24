import React, { useState } from "react";
import SEO from "@/components/SEO";
import { AuthModal } from "@/components/AuthModal";
import { Header, Footer } from "@/components/molecules";

const LAST_UPDATED = "April 23, 2026";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="font-secondary font-bold text-[20px] text-[#0F0F0F]">{title}</h2>
    <div className="font-secondary text-[15px] text-[#555] leading-[1.8] flex flex-col gap-3">
      {children}
    </div>
  </section>
);

const PrivacyPolicyPage: React.FC = () => {
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  return (
    <>
      <SEO
        title="Privacy Policy – UXBoard"
        description="Learn how UXBoard collects, uses, and protects your personal information."
        keywords="UXBoard privacy policy, data policy, personal data"
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
              Legal
            </p>
            <h1 className="font-secondary font-extrabold text-[42px] md:text-[56px] text-white leading-[1.05] mb-4">
              Privacy Policy
            </h1>
            <p className="font-secondary text-[14px] text-white/35">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="w-full bg-white py-16">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[860px] flex flex-col gap-10">
            <Section title="1. Introduction">
              <p>
                Welcome to UXBoard ("we", "our", "us"). UXBoard is a design research platform that helps designers, product managers, and developers discover mobile app UI patterns and screenshots. We are committed to protecting your personal information and being transparent about how we use it.
              </p>
              <p>
                This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it. By using UXBoard, you agree to the practices described in this policy.
              </p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="2. Information We Collect">
              <p><strong className="text-[#0F0F0F]">Account information:</strong> When you register, we collect your name, email address, and any profile details you provide.</p>
              <p><strong className="text-[#0F0F0F]">Usage data:</strong> We automatically collect information about how you use UXBoard — pages visited, features used, search queries, and session timestamps.</p>
              <p><strong className="text-[#0F0F0F]">Device & browser information:</strong> We collect technical information such as your IP address, browser type, operating system, and referring URLs to improve our service.</p>
              <p><strong className="text-[#0F0F0F]">Payment information:</strong> If you subscribe to a paid plan, payment details are processed by Stripe. We do not store your full card details on our servers.</p>
              <p><strong className="text-[#0F0F0F]">Cookies:</strong> We use cookies and similar technologies to maintain sessions, remember preferences, and gather analytics. You can manage cookies through your browser settings.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="3. How We Use Your Information">
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Provide, maintain, and improve our platform and features</li>
                <li>Process transactions and manage your subscription</li>
                <li>Send transactional emails (account confirmations, password resets)</li>
                <li>Send service updates and product announcements (you can opt out at any time)</li>
                <li>Analyze usage patterns to make better product decisions</li>
                <li>Prevent fraud and enforce our Terms of Service</li>
              </ul>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="4. Third-Party Services">
              <p>We use the following third-party providers, each with their own privacy practices:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li><strong className="text-[#0F0F0F]">Firebase (Google):</strong> Authentication and real-time database. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Google Privacy Policy</a>.</li>
                <li><strong className="text-[#0F0F0F]">Mixpanel:</strong> Product analytics to understand feature usage. See <a href="https://mixpanel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Mixpanel Privacy Policy</a>.</li>
                <li><strong className="text-[#0F0F0F]">Stripe:</strong> Secure payment processing. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Stripe Privacy Policy</a>.</li>
                <li><strong className="text-[#0F0F0F]">Google Fonts & CDN assets:</strong> May transmit your IP address to Google servers.</li>
              </ul>
              <p>We do not sell your personal data to any third party.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="5. Data Retention">
              <p>We retain your personal data for as long as your account is active or as needed to provide our services. If you close your account, we will delete or anonymise your data within 90 days, except where we are required to retain it for legal reasons.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="6. Your Rights">
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li><strong className="text-[#0F0F0F]">Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong className="text-[#0F0F0F]">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-[#0F0F0F]">Deletion:</strong> Request deletion of your personal data ("right to be forgotten").</li>
                <li><strong className="text-[#0F0F0F]">Portability:</strong> Request your data in a machine-readable format.</li>
                <li><strong className="text-[#0F0F0F]">Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
              </ul>
              <p>To exercise any of these rights, contact us at <a href="mailto:privacy@uxboard.art" className="text-purple-600 hover:underline">privacy@uxboard.art</a>.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="7. Security">
              <p>We implement industry-standard technical and organisational measures to protect your data — including HTTPS encryption, access controls, and regular security reviews. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="8. Children's Privacy">
              <p>UXBoard is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="9. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. When we make significant changes, we will notify you via email or a prominent notice on the platform. The "last updated" date at the top of this page reflects the most recent revision. Continued use of UXBoard after changes are posted constitutes your acceptance of the revised policy.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="10. Contact Us">
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us:</p>
              <p>
                <strong className="text-[#0F0F0F]">Email:</strong>{" "}
                <a href="mailto:privacy@uxboard.art" className="text-purple-600 hover:underline">
                  privacy@uxboard.art
                </a>
              </p>
              <p>
                <strong className="text-[#0F0F0F]">Website:</strong>{" "}
                <a href="https://uxboard.art" className="text-purple-600 hover:underline">
                  https://uxboard.art
                </a>
              </p>
            </Section>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isOpenAuth} onClose={() => setIsOpenAuth(false)} />
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;

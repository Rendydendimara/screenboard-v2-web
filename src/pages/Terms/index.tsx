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

const TermsPage: React.FC = () => {
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  return (
    <>
      <SEO
        title="Terms & Conditions – UXBoard"
        description="Read UXBoard's terms of service, subscription terms, acceptable use policy, and user guidelines."
        keywords="UXBoard terms of service, terms and conditions, subscription terms, acceptable use"
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
              Terms &amp; Conditions
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
            <div className="p-5 rounded-[16px] bg-[#F8F8F8] border border-[#EBEBEB]">
              <p className="font-secondary text-[14px] text-[#555] leading-[1.75]">
                By accessing or using UXBoard, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, you may not use our service. Please read them carefully.
              </p>
            </div>

            <Section title="1. Description of Service">
              <p>
                UXBoard is an online design research platform that provides curated mobile app screenshots, UI patterns, and design references for designers, product managers, developers, and design researchers. We offer both free and paid subscription tiers with varying levels of access to our content library.
              </p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="2. User Accounts">
              <p>To access certain features of UXBoard, you must create an account. You agree to:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account password</li>
                <li>Promptly notify us of any unauthorised use of your account</li>
                <li>Be responsible for all activity that occurs under your account</li>
              </ul>
              <p>You must be at least 13 years of age to create an account. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="3. Subscription & Payments">
              <p><strong className="text-[#0F0F0F]">Free tier:</strong> Access to a limited selection of app screenshots and UI patterns, with download restrictions.</p>
              <p><strong className="text-[#0F0F0F]">Paid plans:</strong> Full access to all screens, unlimited downloads, bulk export, comparison tools, and priority feature access.</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Subscriptions are billed on a monthly or annual basis and auto-renew unless cancelled.</li>
                <li>You may cancel your subscription at any time from your account profile. Cancellation takes effect at the end of the current billing period.</li>
                <li>We do not offer automatic refunds for partial periods, but refund requests are reviewed on a case-by-case basis. Contact us at <a href="mailto:legal@uxboard.art" className="text-purple-600 hover:underline">legal@uxboard.art</a>.</li>
                <li>Prices may change with 30 days' advance notice to existing subscribers.</li>
              </ul>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="4. Acceptable Use">
              <p>You agree not to use UXBoard to:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Redistribute, resell, or sublicense UXBoard content without written permission</li>
                <li>Use screenshots or designs for commercial reproduction or passing off as original work</li>
                <li>Attempt to scrape, crawl, or systematically copy content from the platform</li>
                <li>Reverse-engineer or attempt to derive source code from the platform</li>
                <li>Upload or transmit malicious code, viruses, or harmful software</li>
                <li>Violate any applicable local, national, or international law or regulation</li>
                <li>Harass, impersonate, or harm other users or UXBoard staff</li>
              </ul>
              <p>We reserve the right to suspend or terminate access for any user who violates these terms without prior notice.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="5. Intellectual Property">
              <p>
                All app screenshots displayed on UXBoard are owned by their respective application developers and companies. UXBoard curates these screenshots solely for design research, inspiration, and educational purposes under the principle of fair use. We do not claim ownership of any third-party app screenshots.
              </p>
              <p>
                All UXBoard branding, UI design, code, copy, and original content are the exclusive intellectual property of UXBoard. Unauthorised reproduction of UXBoard's original content is prohibited.
              </p>
              <p>
                If you are the owner of a screenshot displayed on UXBoard and wish to have it removed, please contact us at <a href="mailto:legal@uxboard.art" className="text-purple-600 hover:underline">legal@uxboard.art</a> and we will act promptly.
              </p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="6. User-Generated Content">
              <p>If you submit requests, feedback, or other content through UXBoard, you grant us a non-exclusive, royalty-free licence to use, display, and process that content to improve our service. You retain ownership of your submissions.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="7. Disclaimer of Warranties">
              <p>
                UXBoard is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not guarantee that:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>The service will be uninterrupted, timely, or error-free</li>
                <li>The content is accurate, complete, or current</li>
                <li>The service will meet your specific requirements or expectations</li>
              </ul>
              <p>We reserve the right to modify, suspend, or discontinue any part of the service at any time.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="8. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, UXBoard and its affiliates, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising out of or related to your use of the service, even if we have been advised of the possibility of such damages.
              </p>
              <p>Our total liability to you for any claims arising out of these Terms shall not exceed the amount you paid to UXBoard in the 12 months preceding the claim.</p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="9. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Indonesia, without regard to conflict of law principles. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Indonesia.
              </p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="10. Changes to These Terms">
              <p>
                We reserve the right to update or modify these Terms at any time. When we make significant changes, we will notify you via email or by posting a notice on the platform. The "last updated" date at the top reflects the most recent revision. Your continued use of UXBoard after changes are posted constitutes your acceptance of the revised Terms.
              </p>
            </Section>

            <div className="w-full h-px bg-[#F0F0F0]" />

            <Section title="11. Contact">
              <p>If you have any questions about these Terms, please contact us:</p>
              <p>
                <strong className="text-[#0F0F0F]">Email:</strong>{" "}
                <a href="mailto:legal@uxboard.art" className="text-purple-600 hover:underline">
                  legal@uxboard.art
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

export default TermsPage;

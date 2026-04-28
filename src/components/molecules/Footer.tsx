import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Applications", to: "/" },
  { label: "Home v2.0", to: "/home-v2" },
  { label: "Product Ideas", to: "/product-ideas" },
  { label: "Request a Screenshot", to: "/request" },
  { label: "Pricing", to: "/pricing" },
];

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0C0C0C] text-white">
      <div className="w-full flex justify-center px-4 md:px-0">
        <div className="w-full max-w-[1200px] py-14 flex flex-col gap-10">
          {/* Top row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col gap-3 max-w-[280px]">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/images/logo.png"
                  alt="UXBoard logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="font-belanosima text-[22px] text-purple-400 leading-none">
                  UXBoard
                </span>
              </div>
              <p className="font-secondary text-[13px] text-white/50 leading-[1.65]">
                Discover inspiring mobile app designs. Browse hundreds of real
                screenshots and UI patterns, organized by category.
              </p>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-3">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30">
                Explore
              </p>
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="font-secondary text-[14px] text-white/60 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Built with */}
            <div className="flex flex-col gap-3">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30">
                Built with
              </p>
              <ul className="flex flex-col gap-2.5">
                {["React", "Tailwind CSS", "Framer Motion", "Vite"].map(
                  (tech) => (
                    <li
                      key={tech}
                      className="font-secondary text-[14px] text-white/60"
                    >
                      {tech}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <p className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-white/30">
                Legal
              </p>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="font-secondary text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="font-secondary text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="font-secondary text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10" />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <p className="font-secondary text-[12px] text-white/30">
              © {new Date().getFullYear()} UXBoard. All rights reserved.
            </p>
            <p className="font-secondary text-[12px] text-white/20">
              Design research, reimagined.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

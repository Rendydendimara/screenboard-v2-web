import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Footer } from "@/components/molecules";
import SEO from "@/components/SEO";
import {
  Sparkles,
  Zap,
  Eye,
  BarChart3,
  Users,
  Layers,
  Smartphone,
  Search,
  Heart,
  MessageSquare,
  BookOpen,
  Palette,
  ArrowLeft,
} from "lucide-react";

type Status = "Implemented" | "In Progress" | "Planned" | "Idea";

interface Idea {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: Status;
  tag: string;
}

const STATUS_STYLE: Record<Status, string> = {
  Implemented: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Planned: "bg-amber-100 text-amber-700",
  Idea: "bg-slate-100 text-slate-600",
};

const IDEAS: Idea[] = [
  {
    icon: <Eye className="w-5 h-5 text-blue-500" />,
    tag: "Discovery",
    title: "Quick Screen Preview on Hover",
    description:
      "Show a popover with the first 2–3 screenshots when hovering over an app card, so users can skim content without clicking into detail.",
    status: "Planned",
  },
  {
    icon: <Layers className="w-5 h-5 text-purple-500" />,
    tag: "Navigation",
    title: "Tabbed Detail View by Flow",
    description:
      "Group screens by user flow (Onboarding, Auth, Home, Settings) as top-level tabs inside the detail page — reduces cognitive load when scanning.",
    status: "Idea",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
    tag: "AI",
    title: "AI-Powered Design Pattern Summary",
    description:
      "Auto-generate a short paragraph summarizing the app's design language: color palette, typography style, interaction patterns — powered by a vision model.",
    status: "Idea",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-green-500" />,
    tag: "Analytics",
    title: "Color Palette Extractor",
    description:
      "Extract the dominant color palette from each screen and display it as swatch chips on the detail page. Useful for design token inspiration.",
    status: "In Progress",
  },
  {
    icon: <Heart className="w-5 h-5 text-red-500" />,
    tag: "Personalization",
    title: "Personalized Recommendations",
    description:
      "Based on apps bookmarked and categories browsed, surface a 'For You' section on the homepage with tailored app suggestions.",
    status: "Planned",
  },
  {
    icon: <Users className="w-5 h-5 text-indigo-500" />,
    tag: "Social",
    title: "Community Collections",
    description:
      "Let users create and share curated collections of apps (e.g., 'Best fintech onboarding'). Browsable by the community, votable, and embeddable.",
    status: "Idea",
  },
  {
    icon: <Search className="w-5 h-5 text-sky-500" />,
    tag: "Search",
    title: "Visual Search (Search by Screenshot)",
    description:
      "Upload any app screenshot and find visually similar screens across the library using image embeddings — a fast way to find inspiration from a reference.",
    status: "Idea",
  },
  {
    icon: <Smartphone className="w-5 h-5 text-orange-500" />,
    tag: "Comparison",
    title: "Side-by-Side Screen Diff",
    description:
      "When comparing two apps, offer a slider overlay to visually diff specific screens side-by-side — great for spotting design pattern differences.",
    status: "Planned",
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-teal-500" />,
    tag: "Engagement",
    title: "Screen-Level Comments & Annotations",
    description:
      "Allow logged-in users to pin comments directly onto individual screens with coordinate-based anchors — collaborative UX analysis.",
    status: "Idea",
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-600" />,
    tag: "Performance",
    title: "Instant Screen Modal (No Navigation)",
    description:
      "Open screen images in a full-screen modal without navigating away from the grid, with keyboard arrow navigation through all screens.",
    status: "Implemented",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-violet-500" />,
    tag: "Education",
    title: "Design Pattern Documentation",
    description:
      "Attach a short editorial writeup to each screen category explaining why the pattern works, when to use it, and common pitfalls — like a pattern library.",
    status: "Idea",
  },
  {
    icon: <Palette className="w-5 h-5 text-pink-500" />,
    tag: "Export",
    title: "Export to Figma Variables",
    description:
      "One-click export of extracted color palettes from any app as Figma local variables — bridging inspiration with tooling.",
    status: "Idea",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const ProductIdeasPage = () => {
  const statusCounts = IDEAS.reduce((acc, idea) => {
    acc[idea.status] = (acc[idea.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <SEO
        title="Product Enhancement Ideas | UXBoard"
        description="Ideas and planned enhancements for the UXBoard product detail experience."
      />

      {/* Hero */}
      <div className="min-h-screen bg-[#0C0C0C]">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[140px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-700/15 blur-[120px] pointer-events-none" />

        <div className="relative w-full flex justify-center px-4 md:px-0 pt-16 pb-20">
          <div className="w-full max-w-[900px] flex flex-col gap-8">
            {/* Back link */}
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[13px] font-secondary text-white/40 hover:text-white/70 transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border border-white/10 bg-white/5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[12px] font-secondary font-medium text-white/60 tracking-wide">
                Product Roadmap & Ideas
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="text-[40px] md:text-[64px] font-secondary font-extrabold text-white leading-[1.05]"
            >
              Enhancement{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ideas
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-[17px] font-secondary text-white/50 leading-[1.7] max-w-[600px]"
            >
              A living backlog of design improvements, feature ideas, and UX
              experiments for UXBoard's product detail experience.
            </motion.p>

            {/* Status legend */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              {(Object.keys(STATUS_STYLE) as Status[]).map((status) => (
                <div
                  key={status}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                >
                  <span
                    className={`text-[11px] font-secondary font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[status]}`}
                  >
                    {status}
                  </span>
                  <span className="text-[12px] font-secondary text-white/40">
                    {statusCounts[status] ?? 0}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="bg-white py-16 px-4 md:px-0">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1200px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {IDEAS.map((idea, i) => (
                <motion.div
                  key={idea.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="flex flex-col gap-4 bg-[#FAFAFA] border border-[#F0F0F0] rounded-[20px] p-6 hover:border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-[12px] bg-white border border-[#F0F0F0] flex items-center justify-center shrink-0">
                      {idea.icon}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-secondary font-semibold tracking-[0.1em] uppercase text-[#939393] bg-[#F0F0F0] px-2 py-0.5 rounded-full">
                        {idea.tag}
                      </span>
                      <span
                        className={`text-[10px] font-secondary font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[idea.status]}`}
                      >
                        {idea.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-secondary font-bold text-[16px] text-[#0F0F0F] leading-tight">
                      {idea.title}
                    </h3>
                    <p className="font-secondary text-[13px] text-[#6B6B6B] leading-[1.65]">
                      {idea.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductIdeasPage;

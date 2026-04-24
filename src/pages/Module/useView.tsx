import { AuthModal } from "@/components/AuthModal";
import { HeroSectionModule } from "@/components/HeroSectionModule";
import { Header } from "@/components/molecules";
import { Footer } from "@/components/molecules";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import useController from "./useController";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

const ModulePage = () => {
  const {
    user,
    searchTerm,
    handleChangeSearch,
    scrolled,
    setIsOpenAuth,
    callbackAuth,
    handleOpenAuthModal,
    scrolledSearch,
    onCloseOpenAuth,
    isOpenAuth,
    displayedModuls,
    isLoading,
    hasMoreItems,
    loadMoreItems,
  } = useController();

  const modulesRef = useRef<HTMLElement>(null);

  const handleScrollToModules = () => {
    if (!modulesRef.current) return;
    const yOffset = -80;
    const y =
      modulesRef.current.getBoundingClientRect().top +
      window.scrollY +
      yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="UI Modules & Design Patterns | UXBoard"
        description="Browse curated UI modules and design patterns from the world's best mobile apps. Find inspiration for onboarding, checkout, login, and more."
      />
      <div className="min-h-screen bg-white">
        {/* Fixed Header */}
        <section className="relative overflow-hidden bg-[#E0E0E033]">
          <Header
            showSearch={true}
            searchTerm={searchTerm}
            onSearchChange={handleChangeSearch}
            scrolled={scrolled}
            scrolledSearch={scrolledSearch}
            onOpenAuthModal={() => setIsOpenAuth(true)}
            transparentBg={true}
            callbackLogout={callbackAuth}
          />

          {/* Hero Section */}
          <div className="pt-16 lg:pt-20">
            <HeroSectionModule
              onClickBtn={handleOpenAuthModal}
              onClickExplore={handleScrollToModules}
              isLogin={!!user}
            />
          </div>
        </section>
        {/* Main Content */}
        <main ref={modulesRef} className="w-full flex justify-center items-center py-6 px-4 md:px-0 md:py-8 lg:py-12 ">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">

            {/* Section Header — editorial style */}
            <motion.div
              className="flex flex-col items-start gap-4 mb-10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                <span className="text-[11px] font-secondary font-semibold tracking-[0.14em] text-[#939393] uppercase">
                  Module Library
                </span>
              </div>

              {/* Heading + subtitle */}
              <div className="flex flex-col gap-2">
                <h2 className="text-[36px] md:text-[40px] font-secondary font-extrabold text-[#0F0F0F] leading-[1.1]">
                  Browse by Module
                </h2>
                <p className="text-[#939393] font-secondary font-normal text-[15px] leading-[1.5]">
                  Organized patterns for Login, Register, Cart, Checkout, and more.
                </p>
              </div>
            </motion.div>

            <InfiniteScrollList
              moduls={displayedModuls}
              hasMoreItems={hasMoreItems}
              loadMoreItems={loadMoreItems}
              isLoading={isLoading}
            />

            {!user && (
              <div className="h-[831px] w-full left-0 right-0  -mt-[22rem] flex justify-center items-center opacity-100 pt-[128px] pb-[32px] bg-[linear-gradient(180.06deg,rgba(255,255,255,0)_3.54%,#FFFFFF_27.5%)] absolute">
                <div className="flex flex-col gap-3 items-center justify-center max-w-[1360px]">
                  <h5 className="font-['Inter'] max-w-[1200px] font-semibold text-[32px] md:text-[64px] leading-[80px] text-center bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Join and unlock 100+ curated app from around the world
                  </h5>
                  <p className="font-secondary font-medium text-[16px] md:text-[20px] text-[#464C4F] leading-[31px] text-center">
                    We believe real design give more sense to your design
                    process
                  </p>
                  <Badge
                    onClick={handleOpenAuthModal}
                    className="hover:cursor-pointer bg-gradient-to-r h-[58px] rounded-[20px] from-blue-500 to-purple-600 border-0 px-8 py-3 flex justify-center items-center gap-2"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.73666 2.16675C6.87166 1.86258 7.17249 1.66675 7.50583 1.66675H14.1533C14.7783 1.66675 15.1858 2.32508 14.9058 2.88508L13.015 6.66675H15.8133C16.5633 6.66675 16.9383 7.57341 16.4083 8.10341L6.44749 18.0642C5.81916 18.6926 4.77249 18.0459 5.05416 17.2034L7.17749 10.8334H4.17916C4.03895 10.8334 3.90096 10.7984 3.77772 10.7315C3.65449 10.6646 3.54992 10.568 3.4735 10.4504C3.39709 10.3329 3.35125 10.1981 3.34016 10.0583C3.32907 9.91855 3.35307 9.77822 3.40999 9.65008L6.73666 2.16675Z"
                        fill="#F8B303"
                      />
                    </svg>

                    <div className="flex flex-col items-start gap-1">
                      <p className="font-secondary font-bold text-[18px] text-[#FFFFFF]">
                        Join Membership
                      </p>
                      <p className="font-secondary font-[300] text-[12px] text-[#E1E1E1]">
                        Free Membership — This Month Only
                      </p>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.73666 2.16675C6.87166 1.86258 7.17249 1.66675 7.50583 1.66675H14.1533C14.7783 1.66675 15.1858 2.32508 14.9058 2.88508L13.015 6.66675H15.8133C16.5633 6.66675 16.9383 7.57341 16.4083 8.10341L6.44749 18.0642C5.81916 18.6926 4.77249 18.0459 5.05416 17.2034L7.17749 10.8334H4.17916C4.03895 10.8334 3.90096 10.7984 3.77772 10.7315C3.65449 10.6646 3.54992 10.568 3.4735 10.4504C3.39709 10.3329 3.35125 10.1981 3.34016 10.0583C3.32907 9.91855 3.35307 9.77822 3.40999 9.65008L6.73666 2.16675Z"
                        fill="#F8B303"
                      />
                    </svg>
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </main>

        <AuthModal
          initialMode="login"
          isOpen={isOpenAuth}
          onClose={onCloseOpenAuth}
          callbackSuccessLogin={callbackAuth}
        />
      </div>
      <Footer />
    </>
  );
};

export default ModulePage;

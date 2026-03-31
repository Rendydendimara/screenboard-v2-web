import { AuthModal } from "@/components/AuthModal";
import { HeroSectionModule } from "@/components/HeroSectionModule";
import { Header } from "@/components/molecules";
import SEO from "@/components/SEO";
import useController from "./useController";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import { Badge } from "@/components/ui/badge";

const ModulePage = () => {
  const {
    user,
    searchTerm,
    handleChangeSearch,
    scrolled,
    setIsOpenAuth,
    setShowCompare,
    callbackAuth,
    handleOpenAuthModal,
    scrolledSearch,
    onCloseOpenAuth,
    isOpenAuth,
  } = useController();

  return (
    <>
      <SEO
        title="Screenboard"
        description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
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
            onShowCompare={() => setShowCompare(true)}
            transparentBg={true}
            callbackLogout={callbackAuth}
          />

          {/* Hero Section */}
          <div className="pt-16 lg:pt-20">
            <HeroSectionModule
              onClickBtn={handleOpenAuthModal}
              isLogin={!!user}
            />
          </div>
        </section>
        {/* Main Content */}
        <main className="w-full flex justify-center items-center py-6 md:px-0 md:py-8 lg:py-12 ">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
            <div className="flex flex-col items-center gap-4 mb-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 4C10.8453 4 6.66666 8.36267 6.66666 13.3333V26.6667C6.66666 27.0203 6.80713 27.3594 7.05718 27.6095C7.30723 27.8595 7.64637 28 7.99999 28H24C24.3536 28 24.6928 27.8595 24.9428 27.6095C25.1928 27.3594 25.3333 27.0203 25.3333 26.6667V13.3333C25.3333 8.36267 21.1547 4 16 4ZM16 4V28M6.66666 17.3333H25.3333"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="flex flex-col gap-1 items-center">
                <p
                  className="
                    text-[32px]
                    font-bold
                    font-secondary
                    bg-gradient-to-r from-blue-600 to-purple-600
                    bg-clip-text
                    text-transparent
                  "
                >
                  Explore All Module
                </p>
                <p className="text-[#B9B9B9] font-secondar yfont-medium text-[18px] leading-[100%] tracking-[0%]">
                  Collected with carefully, enjoy your exploration
                </p>
              </div>
            </div>

            <InfiniteScrollList
              hasMoreItems={false}
              loadMoreItems={function (): void {
                throw new Error("Function not implemented.");
              }}
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
    </>
  );
};

export default ModulePage;

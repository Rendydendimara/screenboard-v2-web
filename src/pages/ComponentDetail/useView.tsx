import { AuthModal } from "@/components/AuthModal";
import { Header } from "@/components/molecules";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/utils";
import { ArrowLeft, Monitor } from "lucide-react";
import React from "react";
import useController from "./useController";

const useView: React.FC = () => {
  const {
    component,
    isLoadingDetail,
    selectedImage,
    scrolled,
    isOpenAuth,
    handleOpenAuthModal,
    onCloseOpenAuth,
    handleImageClick,
    goBack,
  } = useController();

  if (isLoadingDetail) {
    return (
      <>
        <SEO
          title="Loading... | Screenboard"
          description="Discover and explore amazing component designs."
        />
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Header
            scrolled={scrolled}
            onOpenAuthModal={handleOpenAuthModal}
            transparentBg={true}
          />

          {/* Component Overview Skeleton */}
          <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-[1200px]">
              <div className="pt-24 px-4 md:px-0 pb-[40px]">
                <Skeleton className="h-10 w-32 mb-6" />
                <Skeleton className="h-12 w-96 mb-4" />
                <Skeleton className="h-20 w-full max-w-[700px] mb-6" />
                <div className="flex gap-2 mb-8">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots Skeleton */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[1200px]">
            <div className="px-4 md:px-0 py-12">
              <div className="flex gap-6">
                <Skeleton className="w-[590px] h-[363px] rounded-xl" />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="w-full h-[160px] rounded-xl" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!component) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Component Not Found
          </h2>
          <Button onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Components
          </Button>
        </div>
      </div>
    );
  }

  const selectedImageData = component.screenshots.find(
    (img) => img._id === selectedImage
  );

  return (
    <>
      <SEO
        title={`${component.name} | Screenboard`}
        description={component.description}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header
          scrolled={scrolled}
          onOpenAuthModal={handleOpenAuthModal}
          transparentBg={true}
        />

        {/* Component Overview */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[1200px]">
            <div className="pt-24 px-4 md:px-0 pb-[40px] flex justify-center items-center">
              <div className="max-w-[590px]">
                <div className="flex justify-center items-center flex-col gap-6">
                  <h1 className="font-[Inter] font-bold text-[29.3px] leading-[36px] tracking-[0%] text-[#0F172A]">
                    {component.name}
                  </h1>
                  <div className="flex flex-col gap-3 w-full">
                    <p className="font-[Inter] font-normal text-[16px] leading-[150%] tracking-[0%] text-center text-[#334155]">
                      {component.description}
                    </p>

                    <div className="flex items-center justify-center gap-3">
                      {component.tags.map((tag, i) => (
                        <div
                          key={i}
                          className="px-[13px] py-[5px] rounded-full border  border-solid border-[#E0E1E1] font-[Inter] font-bold text-[13.7px] leading-[20px] tracking-[0%] text-[#464C4F]"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <div className="w-full flex justify-center items-center bg-white">
        <div className="w-full max-w-[1000px]">
          <div className="px-4 md:px-0 py-12">
            <div className="flex gap-6 flex-col lg:flex-row">
              {/* Main Image */}
              <div className="flex-shrink-0">
                {selectedImageData && (
                  <div className="relative w-[652px] h-[404px] rounded-[20px] overflow-hidden bg-black flex items-center justify-center group">
                    <img
                      src={getImageUrl(selectedImageData.filePath)}
                      alt={selectedImageData.fileName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Grid */}
              <div className="flex-1">
                <div className="flex flex-col gap-5 items-start max-h-[60vh] pl-1 overflow-auto">
                  {component.screenshots.slice(0, 10).map((img) => (
                    <div
                      key={img._id}
                      className={`flex flex-col gap-2 cursor-pointer ${
                        selectedImage === img._id
                          ? "ring-2 ring-blue-500 rounded-xl"
                          : ""
                      }`}
                      onClick={() => handleImageClick(img._id)}
                    >
                      <div className="w-full h-[209px] rounded-xl overflow-hidden bg-slate-100 hover:opacity-80 transition-opacity">
                        <img
                          src={getImageUrl(img.filePath)}
                          alt={img.fileName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-[Inter] font-medium text-[12px] leading-[100%] text-[#565D61] px-2">
                        {img.fileName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        initialMode="login"
        isOpen={isOpenAuth}
        onClose={onCloseOpenAuth}
      />
    </>
  );
};

export default useView;

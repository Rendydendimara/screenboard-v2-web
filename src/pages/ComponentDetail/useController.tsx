import GlobalComponentAPI from "@/api/user/globalComponent/api";
import { TGlobalComponentRes } from "@/api/user/globalComponent/type";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const useController = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [component, setComponent] = useState<TGlobalComponentRes | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  const containerMainRef = useRef<HTMLDivElement>(null);

  const getData = async () => {
    setIsLoadingDetail(true);
    try {
      const res = await GlobalComponentAPI.getDetail(id!);
      const data: TGlobalComponentRes = res.data;
      setComponent(data);

      // Get imgid from query params
      const imgId = searchParams.get("imgid");
      if (imgId && data.screenshots) {
        const screenshot = data.screenshots.find((s) => s._id === imgId);
        if (screenshot) {
          setSelectedImage(screenshot._id);
        } else if (data.screenshots.length > 0) {
          setSelectedImage(data.screenshots[0]._id);
        }
      } else if (data.screenshots && data.screenshots.length > 0) {
        setSelectedImage(data.screenshots[0]._id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenAuthModal = useCallback(() => {
    setIsOpenAuth(true);
  }, []);

  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);

  const handleImageClick = useCallback((imageId: string) => {
    setSelectedImage(imageId);
  }, []);

  const goBack = useCallback(() => {
    navigate("/component");
  }, [navigate]);

  return {
    component,
    isLoadingDetail,
    selectedImage,
    scrolled,
    isOpenAuth,
    containerMainRef,
    setIsOpenAuth,
    handleOpenAuthModal,
    onCloseOpenAuth,
    handleImageClick,
    goBack,
  };
};

export default useController;

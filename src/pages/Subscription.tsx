import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PricingPlans from '@/components/PricingPlans';
import SubscriptionManager from '@/components/SubscriptionManager';
import UserSubscriptionAPI from '@/api/user/subscription/api';
import { TSubscription } from '@/api/user/subscription/type';
import { useAppDispatch, useTypedSelector } from '@/hooks/use-typed-selector';
import { RootState } from '@/provider/store';
import { logout } from '@/provider/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { GitCompare, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminAuthAPI from '@/api/admin/auth/api';
import UserAuthAPI from '@/api/user/auth/api';
import { AuthModal } from '@/components/AuthModal';
import clsx from 'clsx';

export default function Subscription() {
  const [currentSubscription, setCurrentSubscription] = useState<TSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  const user = useTypedSelector((state: RootState) => state.auth.user);
  const compareApps = useTypedSelector(
    (state: RootState) => state.compare.compareApps
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await UserSubscriptionAPI.getCurrentSubscription();
      if (response.success) {
        setCurrentSubscription(response.data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      let res;
      if (user.userType === 'administrator') {
        res = await AdminAuthAPI.logout();
      } else {
        res = await UserAuthAPI.logout();
      }
      if (res.success) {
        dispatch(logout());
        navigate('/');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
      });
    }
  };

  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);

  const handleOpenAuthModal = useCallback(() => {
    if (user) return;
    setIsOpenAuth(true);
  }, [user]);

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Fixed Header */}
        <header
          className={clsx(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
            scrolled
              ? 'bg-white/90 backdrop-blur-md shadow-sm'
              : 'bg-white shadow-sm'
          )}
        >
          <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-[1200px]">
              <div className="flex items-center justify-between h-16 lg:h-20 px-4 md:px-0">
                {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm lg:text-base">
                    S
                  </span>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center gap-[10px]">
                {user && (
                  <Link to="/favorites">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleOpenAuthModal}
                      className="relative"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.6666 9.33333C13.66 8.36 14.6666 7.19333 14.6666 5.66667C14.6666 4.69421 14.2803 3.76158 13.5927 3.07394C12.9051 2.38631 11.9724 2 11 2C9.82665 2 8.99998 2.33333 7.99998 3.33333C6.99998 2.33333 6.17331 2 4.99998 2C4.02752 2 3.09489 2.38631 2.40725 3.07394C1.71962 3.76158 1.33331 4.69421 1.33331 5.66667C1.33331 7.2 2.33331 8.36667 3.33331 9.33333L7.99998 14L12.6666 9.33333Z"
                          stroke="#94A3B8"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                        Favorites ({user.appLikes.length})
                      </span>
                    </Button>
                  </Link>
                )}
                {user && (
                  <Link to="/subscription">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70725 10 8 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947618 11.2811 0.666668 11.9594 0.666668 12.6667V14M13.3333 5.33333V9.33333M15.3333 7.33333H11.3333M8.33333 4.66667C8.33333 6.13943 7.13943 7.33333 5.66667 7.33333C4.19391 7.33333 3 6.13943 3 4.66667C3 3.19391 4.19391 2 5.66667 2C7.13943 2 8.33333 3.19391 8.33333 4.66667Z"
                          stroke="#94A3B8"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                        Subscription
                      </span>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="relative"
                >
                  <GitCompare className="h-4 w-4" />
                  {compareApps.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {compareApps.length}
                    </Badge>
                  )}
                  <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                    Compare
                  </span>
                </Button>
                {!user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenAuthModal}
                    className="relative"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.66667 8L5.33333 6.53334L5.73333 5.86667M4 3.33333H12L14 6.66667L8.33333 13C8.28988 13.0443 8.23802 13.0796 8.18078 13.1036C8.12355 13.1277 8.06209 13.1401 8 13.1401C7.93792 13.1401 7.87645 13.1277 7.81922 13.1036C7.76198 13.0796 7.71012 13.0443 7.66667 13L2 6.66667L4 3.33333Z"
                        stroke="black"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                      Join Us
                    </span>
                  </Button>
                )}
                {user && (
                  <div className="flex items-center gap-2 px-3">
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9.33333C10.0406 10 10.7189 10.281 11.219 10.781C11.719 11.2811 12 11.9594 12 12.6667V14M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
                            stroke="black"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                          {user.username}
                        </p>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="hidden sm:flex items-center space-x-2 font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle underline [text-decoration-style:solid] [text-decoration-skip-ink:auto] !text-[#4475EE]"
                    >
                      Logout
                    </Button>
                    {user.userType === 'administrator' && (
                      <Link to="/admin">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hidden sm:flex items-center space-x-2"
                        >
                          Admin
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[1200px]">
            <main className="pt-24 lg:pt-28 px-4 md:px-0 py-8">
              <h1 className="text-4xl font-bold mb-8">Subscription</h1>

              <Tabs defaultValue={currentSubscription ? 'manage' : 'plans'} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="plans">Available Plans</TabsTrigger>
                  <TabsTrigger value="manage">Manage Subscription</TabsTrigger>
                </TabsList>

                <TabsContent value="plans">
                  <PricingPlans
                    currentPlanSlug={
                      currentSubscription?.planId?.slug
                    }
                  />
                </TabsContent>

                <TabsContent value="manage">
                  <SubscriptionManager />
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        initialMode="login"
        isOpen={isOpenAuth}
        onClose={onCloseOpenAuth}
      />
    </>
  );
}

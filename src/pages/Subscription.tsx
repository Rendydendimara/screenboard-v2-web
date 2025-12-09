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
import { Header } from '@/components/molecules';

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
        <Header
          scrolled={scrolled}
          onOpenAuthModal={handleOpenAuthModal}
          onShowCompare={() => navigate('/')}
        />

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

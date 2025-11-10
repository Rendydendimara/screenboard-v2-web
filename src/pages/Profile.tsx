import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Package,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  Crown,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  GitCompare,
  Heart
} from 'lucide-react';
import { useTypedSelector, useAppDispatch } from '@/hooks/use-typed-selector';
import { RootState } from '@/provider/store';
import UserSubscriptionAPI from '@/api/user/subscription/api';
import { TSubscription } from '@/api/user/subscription/type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/provider/slices/authSlice';
import UserAuthAPI from '@/api/user/auth/api';
import AdminAuthAPI from '@/api/admin/auth/api';
import { CancelSubscriptionDialog } from '@/components/CancelSubscriptionDialog';
import { AuthModal } from '@/components/AuthModal';
import clsx from 'clsx';

export default function Profile() {
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const compareApps = useTypedSelector(
    (state: RootState) => state.compare.compareApps
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [subscription, setSubscription] = useState<TSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchSubscription();
  }, [user, navigate]);

  const fetchSubscription = async () => {
    setLoadingSubscription(true);
    try {
      const response = await UserSubscriptionAPI.getCurrentSubscription();
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await UserSubscriptionAPI.cancelSubscription();
      if (response.success) {
        setSubscription(response.data);
        toast({
          title: 'Subscription Canceled',
          description: 'Your subscription will be canceled at the end of the billing period.',
        });
      }
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading(true);
    try {
      const response = await UserSubscriptionAPI.reactivateSubscription();
      if (response.success) {
        setSubscription(response.data);
        toast({
          title: 'Subscription Reactivated',
          description: 'Your subscription has been reactivated successfully!',
        });
      }
    } catch (error: any) {
      console.error('Error reactivating subscription:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reactivate subscription',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
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
        description: err.message || 'Failed to logout',
        variant: 'destructive',
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSubscriptionStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      active: { label: 'Active', className: 'bg-green-500', icon: CheckCircle },
      canceled: { label: 'Canceled', className: 'bg-red-500', icon: XCircle },
      past_due: { label: 'Past Due', className: 'bg-orange-500', icon: XCircle },
      trialing: { label: 'Trial', className: 'bg-blue-500', icon: Crown },
      incomplete: { label: 'Incomplete', className: 'bg-gray-500', icon: XCircle },
      unpaid: { label: 'Unpaid', className: 'bg-red-500', icon: XCircle },
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-500', icon: XCircle };
    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (!user) {
    return null;
  }

  const hasActiveSubscription = subscription && ['active', 'trialing'].includes(subscription.status);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
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
            <div className="pt-24 lg:pt-28 px-4 md:px-0 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback className="text-2xl bg-blue-600 text-white">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Email</span>
                  </div>
                  <p className="text-sm font-medium pl-6">{user.email}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Account Type</span>
                  </div>
                  <div className="pl-6">
                    <Badge variant={user.userType === 'administrator' ? 'default' : 'secondary'}>
                      {user.userType === 'administrator' ? 'Administrator' : 'Customer'}
                    </Badge>
                  </div>
                </div>

                {user.createdAt && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600">Member Since</span>
                      </div>
                      <p className="text-sm font-medium pl-6">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2 pt-2">
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Subscription Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Subscription
                    </CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                  </div>
                  {hasActiveSubscription && (
                    <Crown className="h-8 w-8 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingSubscription ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading subscription...
                  </div>
                ) : subscription ? (
                  <>
                    {/* Plan Details */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {subscription.planId?.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {subscription.planId?.description}
                          </p>
                        </div>
                        {getSubscriptionStatusBadge(subscription.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${subscription.planId?.price}/{subscription.planId?.interval}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Next Billing</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {subscription.cancelAtPeriodEnd && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                          <p className="text-sm text-orange-800">
                            <XCircle className="h-4 w-4 inline mr-1" />
                            Your subscription will be canceled on{' '}
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {subscription.planId?.features && subscription.planId.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Plan Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {subscription.planId.features.map((feature, index) => (
                            <div key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex gap-3">
                        <Button
                          className="flex-1"
                          onClick={() => navigate('/subscription')}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Subscription
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={async () => {
                            try {
                              const response = await UserSubscriptionAPI.createBillingPortal();
                              if (response.success && response.data.url) {
                                window.location.href = response.data.url;
                              }
                            } catch (error: any) {
                              toast({
                                title: 'Error',
                                description: error.response?.data?.message || 'Failed to open billing portal',
                                variant: 'destructive',
                              });
                            }
                          }}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Billing Portal
                        </Button>
                      </div>

                      {hasActiveSubscription && (
                        <div className="flex gap-3">
                          {subscription.cancelAtPeriodEnd ? (
                            <Button
                              className="w-full"
                              onClick={handleReactivateSubscription}
                              disabled={actionLoading}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reactivate Subscription
                            </Button>
                          ) : (
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={() => setShowCancelDialog(true)}
                              disabled={actionLoading}
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Cancel Subscription
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Active Subscription
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Subscribe to unlock all premium features
                    </p>
                    <Button onClick={() => navigate('/subscription')}>
                      View Plans
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="text-lg font-semibold capitalize">{subscription.status}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
                      <p className="text-lg font-semibold capitalize">{subscription.planId?.interval}ly</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Auto Renew</p>
                      <p className="text-lg font-semibold">
                        {subscription.cancelAtPeriodEnd ? 'No' : 'Yes'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
            </div>
          </div>
        </div>

        {/* Cancel Subscription Dialog */}
        <CancelSubscriptionDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          subscription={subscription}
          onConfirm={handleCancelSubscription}
        />
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

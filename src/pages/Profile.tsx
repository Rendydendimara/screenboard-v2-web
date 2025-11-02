import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  RefreshCw
} from 'lucide-react';
import { useTypedSelector } from '@/hooks/use-typed-selector';
import { RootState } from '@/provider/store';
import UserSubscriptionAPI from '@/api/user/subscription/api';
import { TSubscription } from '@/api/user/subscription/type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { logout } from '@/provider/slices/authSlice';
import UserAuthAPI from '@/api/user/auth/api';
import { CancelSubscriptionDialog } from '@/components/CancelSubscriptionDialog';

export default function Profile() {
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [subscription, setSubscription] = useState<TSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
      const res = await UserAuthAPI.logout();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Cancel Subscription Dialog */}
      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        subscription={subscription}
        onConfirm={handleCancelSubscription}
      />
    </div>
  );
}

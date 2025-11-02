import { useState, useEffect } from 'react';
import { Calendar, CreditCard, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import UserSubscriptionAPI from '@/api/user/subscription/api';
import { TSubscription, TPaymentHistory } from '@/api/user/subscription/type';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CancelSubscriptionDialog } from './CancelSubscriptionDialog';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionManager() {
  const [subscription, setSubscription] = useState<TSubscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<TPaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const [subResponse, paymentResponse] = await Promise.all([
        UserSubscriptionAPI.getCurrentSubscription(),
        UserSubscriptionAPI.getPaymentHistory(5),
      ]);

      if (subResponse.success) {
        setSubscription(subResponse.data);
      }

      if (paymentResponse.success) {
        setPaymentHistory(paymentResponse.data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
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

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const response = await UserSubscriptionAPI.createBillingPortal();
      if (response.success && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error('Error creating billing portal:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to open billing portal',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' }> = {
      active: { label: 'Active', variant: 'default' },
      canceled: { label: 'Canceled', variant: 'destructive' },
      past_due: { label: 'Past Due', variant: 'destructive' },
      trialing: { label: 'Trial', variant: 'secondary' },
      incomplete: { label: 'Incomplete', variant: 'secondary' },
      unpaid: { label: 'Unpaid', variant: 'destructive' },
    };

    const config = statusConfig[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don't have an active subscription. Please choose a plan to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Subscription</CardTitle>
            {getStatusBadge(subscription.status)}
          </div>
          <CardDescription>
            {subscription.planId?.name || 'Unknown Plan'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-lg font-semibold">
                ${subscription.planId?.price}/{subscription.planId?.interval}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Billing Date</p>
              <p className="text-lg font-semibold flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be canceled on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleManageBilling} disabled={actionLoading} variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </Button>
          {subscription.cancelAtPeriodEnd ? (
            <Button onClick={handleReactivateSubscription} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reactivate Subscription
            </Button>
          ) : (
            <Button onClick={() => setShowCancelDialog(true)} disabled={actionLoading} variant="destructive">
              Cancel Subscription
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent billing history</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <p className="text-sm text-gray-600">No payment history yet.</p>
          ) : (
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(payment.status)}
                    {payment.invoiceUrl && (
                      <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

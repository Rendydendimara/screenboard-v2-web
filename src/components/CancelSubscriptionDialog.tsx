import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: {
    planId: {
      name: string;
      price: number;
    };
    currentPeriodEnd: string;
    status: string;
  } | null;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const CancelSubscriptionDialog: React.FC<CancelSubscriptionDialogProps> = ({
  open,
  onOpenChange,
  subscription,
  onConfirm,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onConfirm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!subscription) return null;

  const periodEndDate = new Date(subscription.currentPeriodEnd);
  const formattedDate = format(periodEndDate, 'MMMM dd, yyyy');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Cancel Subscription
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel your subscription?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Plan Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {subscription.planId.name}
                </h4>
                <p className="text-sm text-gray-600">
                  ${subscription.planId.price}/month
                </p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                {subscription.status}
              </span>
            </div>
          </div>

          {/* What Happens Alert */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">What happens when you cancel:</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                  <li>Your subscription will remain active until the end of your current billing period</li>
                  <li>You'll continue to have access to all features until then</li>
                  <li>No further charges will be made</li>
                  <li>You can reactivate anytime before the period ends</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Access Until */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Access until:
              </p>
              <p className="text-sm text-gray-600">{formattedDate}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Canceling...' : 'Yes, Cancel Subscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, Calendar, DollarSign, Package, AlertCircle } from 'lucide-react';
import UserSubscriptionAPI from '@/api/user/subscription/api';
import { TVerifySessionResponse } from '@/api/user/subscription/type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<TVerifySessionResponse | null>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/subscription');
      return;
    }

    verifySession();
  }, [sessionId, navigate]);

  const verifySession = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await UserSubscriptionAPI.verifySession(sessionId);
      if (response.success) {
        setSessionData(response.data);
      } else {
        setError('Failed to verify session');
      }
    } catch (err: any) {
      console.error('Error verifying session:', err);
      setError(err.response?.data?.message || 'Failed to verify payment session');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        {/* Simple Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="container flex items-center justify-between h-16 lg:h-20 px-4 md:px-6 lg:px-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">S</span>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">Back to Home</Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-screen pt-24 lg:pt-28">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Verifying your payment...</p>
          </CardContent>
        </Card>
        </div>
      </>
    );
  }

  if (error || !sessionData) {
    return (
      <>
        {/* Simple Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <div className="container flex items-center justify-between h-16 lg:h-20 px-4 md:px-6 lg:px-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">S</span>
              </div>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">Back to Home</Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-screen pt-24 lg:pt-28">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Verification Failed</CardTitle>
            <CardDescription>
              We couldn't verify your payment session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error || 'Unknown error occurred'}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" onClick={() => navigate('/subscription')}>
              Back to Subscription
            </Button>
          </CardFooter>
        </Card>
        </div>
      </>
    );
  }

  const { session, subscription } = sessionData;
  const isPaymentSuccessful = session.paymentStatus === 'paid';

  return (
    <>
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container flex items-center justify-between h-16 lg:h-20 px-4 md:px-6 lg:px-0">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm lg:text-base">S</span>
            </div>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">Back to Home</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-screen pt-24 lg:pt-28">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Subscription Successful!</CardTitle>
          <CardDescription className="text-base">
            Thank you for subscribing to Screenboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Payment Details</h3>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <Badge className="bg-green-500">
                {isPaymentSuccessful ? 'Paid' : session.paymentStatus}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{session.customerEmail}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-lg">
                ${session.amountTotal.toFixed(2)} {session.currency.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Subscription Details */}
          {subscription && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Subscription Details
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold">{subscription.planId?.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-medium">
                  ${subscription.planId?.price}/{subscription.planId?.interval}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <Badge
                  variant={subscription.status === 'active' ? 'default' : 'secondary'}
                >
                  {subscription.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Next Billing
                </span>
                <span className="font-medium">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Features */}
          {subscription?.planId?.features && subscription.planId.features.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">What's Included:</h3>
              <ul className="space-y-2">
                {subscription.planId.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confirmation Message */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Email Confirmation</AlertTitle>
            <AlertDescription>
              A confirmation email has been sent to <strong>{session.customerEmail}</strong> with your subscription details and receipt.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" size="lg" onClick={() => navigate('/subscription')}>
            Manage Subscription
          </Button>
          <Button className="w-full" variant="outline" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </CardFooter>
      </Card>
      </div>
    </>
  );
}

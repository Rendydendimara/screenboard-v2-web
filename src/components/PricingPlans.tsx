import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import UserSubscriptionAPI from '@/api/user/subscription/api';
import { TSubscriptionPlan } from '@/api/user/subscription/type';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface PricingPlansProps {
  onSelectPlan?: (planSlug: 'pro' | 'business') => void;
  currentPlanSlug?: string;
}

export default function PricingPlans({ onSelectPlan, currentPlanSlug }: PricingPlansProps) {
  const [plans, setPlans] = useState<TSubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await UserSubscriptionAPI.getPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planSlug: 'pro' | 'business') => {
    if (onSelectPlan) {
      onSelectPlan(planSlug);
      return;
    }

    // Default behavior: create checkout session
    setCheckoutLoading(planSlug);
    try {
      const response = await UserSubscriptionAPI.createCheckoutSession({ planSlug });
      if (response.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      alert(error.response?.data?.message || 'Failed to create checkout session');
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your needs. Upgrade, downgrade, or cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlanSlug === plan.slug;
          const isPopular = plan.slug === 'business';
          const isLoading = checkoutLoading === plan.slug;

          return (
            <Card
              key={plan._id}
              className={`relative ${isPopular ? 'border-blue-500 border-2' : ''} ${
                isCurrentPlan ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                  Current Plan
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.slug)}
                  disabled={isCurrentPlan || isLoading}
                  variant={isPopular ? 'default' : 'outline'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

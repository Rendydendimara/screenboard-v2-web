import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PricingPlans from '@/components/PricingPlans';
import SubscriptionManager from '@/components/SubscriptionManager';
import UserSubscriptionAPI from '@/api/user/subscription/api';
import { TSubscription } from '@/api/user/subscription/type';

export default function Subscription() {
  const [currentSubscription, setCurrentSubscription] = useState<TSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSubscription();
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
      </div>
    </div>
  );
}

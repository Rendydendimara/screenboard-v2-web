import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import { Check, Crown, Zap } from "lucide-react";
import React from "react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const user = useTypedSelector((state: RootState) => state.auth.user);

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Access to 5 apps",
        "Basic filtering",
        "10 screen views per day",
        "Standard support",
      ],
      current: !user?.isPremium,
      popular: false,
      buttonText: "Current Plan",
      icon: Zap,
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      description: "For design professionals",
      features: [
        "Unlimited app access",
        "Advanced filtering & search",
        "Unlimited screen views",
        "Download high-res images",
        "Compare up to 5 apps",
        "Priority support",
        "Export collections",
      ],
      current: user?.isPremium,
      popular: true,
      buttonText: user?.isPremium ? "Current Plan" : "Upgrade Now",
      icon: Crown,
    },
  ];

  const handleUpgrade = () => {
    // In a real app, this would integrate with Stripe
    console.log("Upgrade to Pro plan");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Choose Your Plan
          </DialogTitle>
          <p className="text-slate-600 text-center">
            Unlock powerful features to supercharge your design workflow
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                plan.popular
                  ? "border-blue-500 bg-blue-50/50 scale-105"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-6">
                <div
                  className={`inline-flex p-3 rounded-2xl mb-4 ${
                    plan.popular ? "bg-blue-100" : "bg-slate-100"
                  }`}
                >
                  <plan.icon
                    className={`h-8 w-8 ${
                      plan.popular ? "text-blue-600" : "text-slate-600"
                    }`}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-500 ml-1">/{plan.period}</span>
                </div>
                <p className="text-slate-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={plan.current ? onClose : handleUpgrade}
                className={`w-full h-12 ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700"
                    : plan.current
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Download, Star, Check } from 'lucide-react';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDownloads: number;
  maxDownloads: number;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({
  isOpen,
  onClose,
  currentDownloads,
  maxDownloads
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Download Limit Reached
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Download className="h-5 w-5 text-slate-600" />
              <span className="font-medium">
                {currentDownloads} / {maxDownloads} downloads used
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${(currentDownloads / maxDownloads) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited downloads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">High-resolution exports</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Advanced search filters</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium - $9.99/month
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

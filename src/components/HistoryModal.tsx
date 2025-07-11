
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Eye, Download, Trash2, Calendar } from 'lucide-react';
import { useScreenHistory } from '@/hooks/useScreenHistory';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const { history, clearHistory, getFilteredHistory } = useScreenHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredHistory = getFilteredHistory(
    activeTab === 'all' ? undefined : activeTab as 'viewed' | 'downloaded'
  ).filter(item =>
    item.screenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action: string) => {
    return action === 'downloaded' ? (
      <Download className="h-4 w-4 text-green-600" />
    ) : (
      <Eye className="h-4 w-4 text-blue-600" />
    );
  };

  const getActionColor = (action: string) => {
    return action === 'downloaded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Screen History</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search screens, apps, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">
                  All ({history.length})
                </TabsTrigger>
                <TabsTrigger value="viewed">
                  Viewed ({getFilteredHistory('viewed').length})
                </TabsTrigger>
                <TabsTrigger value="downloaded">
                  Downloaded ({getFilteredHistory('downloaded').length})
                </TabsTrigger>
              </TabsList>
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </Button>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-96">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No history found</p>
                    {searchQuery && (
                      <p className="text-sm">Try adjusting your search terms</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredHistory.map((item, index) => (
                      <div key={`${item.screenId}-${item.timestamp}-${index}`} 
                           className="flex items-center justify-between p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            {getActionIcon(item.action)}
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getActionColor(item.action)}`}
                            >
                              {item.action}
                            </Badge>
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.screenName}</h4>
                            <p className="text-sm text-gray-600">
                              {item.appName} • {item.category}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

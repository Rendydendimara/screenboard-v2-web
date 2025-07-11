
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ReactFlow, 
  Node, 
  Edge, 
  useNodesState, 
  useEdgesState, 
  Background,
  Controls,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ScreenImageModal } from '@/components/ScreenImageModal';

interface Screen {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

interface FlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
  screens: Screen[];
}

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'App Launch', category: 'Discovery' }
  },
  {
    id: 'discovery',
    position: { x: 100, y: 100 },
    data: { label: 'Discovery', category: 'Discovery' }
  },
  {
    id: 'search',
    position: { x: 400, y: 100 },
    data: { label: 'Search', category: 'Discovery' }
  },
  {
    id: 'playback',
    position: { x: 250, y: 200 },
    data: { label: 'Playback', category: 'Playback' }
  },
  {
    id: 'library',
    position: { x: 100, y: 300 },
    data: { label: 'Library', category: 'Library' }
  },
  {
    id: 'profile',
    position: { x: 400, y: 300 },
    data: { label: 'Profile', category: 'Profile' }
  },
  {
    id: 'social',
    position: { x: 250, y: 400 },
    data: { label: 'Social', category: 'Social' }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'start', target: 'discovery', animated: true },
  { id: 'e2', source: 'start', target: 'search', animated: true },
  { id: 'e3', source: 'discovery', target: 'playback' },
  { id: 'e4', source: 'search', target: 'playback' },
  { id: 'e5', source: 'playback', target: 'library' },
  { id: 'e6', source: 'playback', target: 'profile' },
  { id: 'e7', source: 'library', target: 'social' },
  { id: 'e8', source: 'profile', target: 'social' }
];

export const FlowchartModal: React.FC<FlowchartModalProps> = ({
  isOpen,
  onClose,
  screens
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const category = node.data?.category;
    if (typeof category === 'string') {
      setSelectedCategory(category);
      
      // Find screens in this category
      const categoryScreens = screens.filter(screen => screen.category === category);
      if (categoryScreens.length > 0) {
        setSelectedScreen(categoryScreens[0]);
      } else {
        setSelectedScreen(null);
      }
    }
  }, [screens]);

  const getCategoryScreens = (category: string): Screen[] => {
    return screens.filter(screen => screen.category === category);
  };

  const handleScreenChange = (screen: Screen) => {
    setSelectedScreen(screen);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">App User Flow</DialogTitle>
            <p className="text-gray-600">Click on any node to explore screens in that category</p>
          </DialogHeader>
          
          <div className="mt-6">
            <div className="h-96 border rounded-lg">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                style={{ backgroundColor: '#f8fafc' }}
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
            
            {selectedCategory && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedCategory} Screens</h3>
                  <Badge variant="outline">
                    {getCategoryScreens(selectedCategory).length} screens
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getCategoryScreens(selectedCategory).map(screen => (
                    <div 
                      key={screen.id} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedScreen(screen)}
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-[9/16] overflow-hidden">
                          <img 
                            src={screen.image} 
                            alt={screen.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-sm truncate">{screen.name}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedScreen && (
        <ScreenImageModal
          screen={selectedScreen}
          isOpen={!!selectedScreen}
          onClose={() => setSelectedScreen(null)}
          onImageUpdate={() => {}}
          allScreens={getCategoryScreens(selectedCategory)}
          onScreenChange={handleScreenChange}
        />
      )}
    </>
  );
};

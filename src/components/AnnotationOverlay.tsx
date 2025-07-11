
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye, Info, Tag, User, Calendar } from 'lucide-react';
import { Annotation } from '@/types/annotations';

interface AnnotationOverlayProps {
  annotations: Annotation[];
  imageWidth: number;
  imageHeight: number;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  annotations,
  imageWidth,
  imageHeight,
  showAnnotations,
  onToggleAnnotations,
}) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  const visibleAnnotations = annotations.filter(annotation => annotation.isVisible);

  const getAnnotationTypeIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'ui-pattern':
        return '🎨';
      case 'interaction':
        return '👆';
      case 'accessibility':
        return '♿';
      case 'design':
        return '✨';
      case 'technical':
        return '⚙️';
      default:
        return '📝';
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <div className="absolute top-2 right-2 z-20">
        <Button
          variant={showAnnotations ? "default" : "outline"}
          size="sm"
          onClick={onToggleAnnotations}
          className="flex items-center space-x-2"
        >
          <Eye className="h-4 w-4" />
          <span>Annotations ({visibleAnnotations.length})</span>
        </Button>
      </div>

      {/* Annotation Points */}
      {showAnnotations && visibleAnnotations.map((annotation) => (
        <Popover
          key={annotation.id}
          open={selectedAnnotation === annotation.id}
          onOpenChange={(open) => setSelectedAnnotation(open ? annotation.id : null)}
        >
          <PopoverTrigger asChild>
            <button
              className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-transform z-10"
              style={{
                backgroundColor: annotation.color,
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {getAnnotationTypeIcon(annotation.type)}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" side="right">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{annotation.title}</CardTitle>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ borderColor: annotation.color, color: annotation.color }}
                  >
                    {annotation.type.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {annotation.description}
                </p>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Tag className="h-3 w-3" />
                  <span>{annotation.category}</span>
                </div>

                {annotation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {annotation.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{annotation.createdBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(annotation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};

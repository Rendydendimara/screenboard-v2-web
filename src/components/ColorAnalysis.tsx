
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Palette, BarChart3, Download, Eye, EyeOff } from 'lucide-react';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  percentage: number;
}

interface ImageColors {
  imageId: string;
  imageName: string;
  colors: ColorInfo[];
  dominantColor: string;
}

interface ColorAnalysisProps {
  imageColors: ImageColors[];
  isProcessing: boolean;
  processingProgress: { current: number; total: number };
}

export const ColorAnalysis: React.FC<ColorAnalysisProps> = ({
  imageColors,
  isProcessing,
  processingProgress
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllColors, setShowAllColors] = useState(false);

  // Calculate insights
  const allColors = imageColors.flatMap(img => img.colors);
  const colorFrequency = new Map<string, number>();
  
  allColors.forEach(color => {
    colorFrequency.set(color.hex, (colorFrequency.get(color.hex) || 0) + color.percentage);
  });
  
  const topColors = Array.from(colorFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([hex, frequency]) => ({ hex, frequency }));

  const exportColorData = () => {
    const data = {
      summary: {
        totalImages: imageColors.length,
        totalColorsExtracted: allColors.length,
        topColors
      },
      imageDetails: imageColors
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Processing Images...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress 
              value={(processingProgress.current / processingProgress.total) * 100} 
              className="w-full" 
            />
            <p className="text-sm text-gray-600 text-center">
              Processing {processingProgress.current} of {processingProgress.total} images
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (imageColors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Color Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            Upload images to see color analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Color Analysis Summary</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllColors(!showAllColors)}
              >
                {showAllColors ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showAllColors ? 'Hide Details' : 'Show Details'}
              </Button>
              <Button variant="outline" size="sm" onClick={exportColorData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{imageColors.length}</div>
              <div className="text-sm text-gray-600">Images Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{allColors.length}</div>
              <div className="text-sm text-gray-600">Colors Extracted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{topColors.length}</div>
              <div className="text-sm text-gray-600">Top Colors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(allColors.reduce((sum, c) => sum + c.percentage, 0) / imageColors.length)}%</div>
              <div className="text-sm text-gray-600">Avg Coverage</div>
            </div>
          </div>

          {/* Top Colors */}
          <div>
            <h4 className="font-semibold mb-3">Most Common Colors</h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {topColors.map((color, index) => (
                <div key={color.hex} className="text-center">
                  <div
                    className="w-full h-12 rounded-lg border-2 border-gray-200 mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-xs font-mono">{color.hex}</div>
                  <div className="text-xs text-gray-500">#{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Image Analysis */}
      {showAllColors && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Individual Image Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageColors.map((imageColor) => (
                <div
                  key={imageColor.imageId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedImage === imageColor.imageId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(
                    selectedImage === imageColor.imageId ? null : imageColor.imageId
                  )}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: imageColor.dominantColor }}
                    />
                    <div>
                      <h5 className="font-medium text-sm truncate">{imageColor.imageName}</h5>
                      <p className="text-xs text-gray-500">
                        {imageColor.colors.length} colors extracted
                      </p>
                    </div>
                  </div>

                  {selectedImage === imageColor.imageId && (
                    <div className="space-y-2">
                      {imageColor.colors.map((color, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-mono flex-1">{color.hex}</span>
                          <Badge variant="secondary" className="text-xs">
                            {color.percentage}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

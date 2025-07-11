
export interface Annotation {
  id: string;
  screenId: string;
  appId: number;
  x: number; // Position as percentage (0-100)
  y: number; // Position as percentage (0-100)
  title: string;
  description: string;
  type: 'ui-pattern' | 'interaction' | 'accessibility' | 'design' | 'technical';
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isVisible: boolean;
  color: string;
}

export interface AnnotationFormData {
  title: string;
  description: string;
  type: Annotation['type'];
  category: string;
  tags: string[];
  isVisible: boolean;
  color: string;
}

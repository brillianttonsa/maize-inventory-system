import type { ReactNode } from 'react';
import {
  Target,
  Layers,
  Cpu,
  } from 'lucide-react';


export interface WhatMaizeFeatureItem {
  id: number;
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

export const WhatMaizefeatures: WhatMaizeFeatureItem[] = [
  {
    id: 1,
    icon: <Target className="w-8 h-8 text-yellow-900" />,
    title: 'Purpose-Built',
    description:
      'Designed specifically for maize processing businesses with industry-specific workflows and requirements.',
    delay: 0.2,
  },
  {
    id: 2,
    icon: <Layers className="w-8 h-8 text-yellow-900" />,
    title: 'All-in-One',
    description: 'Manage procurement, production, sales, inventory, and finances all from one integrated platform.',
    delay: 0.4,
  },
  {
    id: 3,
    icon: <Cpu className="w-8 h-8 text-yellow-900" />,
    title: 'AI-Powered',
    description: 'Leverage artificial intelligence for demand forecasting, predictive maintenance, and optimization.',
    delay: 0.6,
  },
];




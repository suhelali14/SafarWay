import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuickStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'amber';
  onClick?: () => void;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: 'bg-blue-100 text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: 'bg-green-100 text-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: 'bg-purple-100 text-purple-600',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: 'bg-amber-100 text-amber-600',
  },
};

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  onClick,
}) => {
  const colorClasses = colorVariants[color];
  
  return (
    <div 
      className={cn(
        "flex flex-col p-5 rounded-lg transition-all duration-200",
        colorClasses.bg,
        onClick && "cursor-pointer hover:shadow-md transform hover:-translate-y-1"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={cn("text-sm font-medium opacity-70", colorClasses.text)}>{title}</h3>
          <p className={cn("text-2xl font-bold mt-1", colorClasses.text)}>{value}</p>
        </div>
        <div className={cn("p-2 rounded-full", colorClasses.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default QuickStatsCard; 
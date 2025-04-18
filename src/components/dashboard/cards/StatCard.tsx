import React, { ReactNode } from 'react';
import { Card, CardContent } from '../../ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  color?: string;
  bgColor?: string;
  footer?: ReactNode;
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  color = "text-blue-600",
  bgColor = "bg-blue-100",
  footer
}: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change !== undefined && (
              <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <div className={`${bgColor} p-3 rounded-full`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
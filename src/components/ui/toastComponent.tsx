import React from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ title, description, variant = 'default', onClose }) => {
  const variantStyles = {
    default: 'bg-white text-black',
    destructive: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
  };

  return (
    <div className={`flex items-start p-4 rounded shadow ${variantStyles[variant]}`}>
      <div className="flex-1">
        <h4 className="font-bold">{title}</h4>
        {description && <p className="text-sm mt-1">{description}</p>}
      </div>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};
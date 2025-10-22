import React, { useState } from 'react';
import { Plus, X, Camera, Video, Mic, Type } from 'lucide-react';
import QuickUpload from './QuickUpload';

const FloatingUploadButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickUpload, setShowQuickUpload] = useState(false);

  const quickActions = [
    {
      icon: Camera,
      label: 'Photo',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setShowQuickUpload(true),
    },
    {
      icon: Video,
      label: 'Video',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => setShowQuickUpload(true),
    },
    {
      icon: Mic,
      label: 'Reel',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => setShowQuickUpload(true),
    },
    {
      icon: Type,
      label: 'Story',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setShowQuickUpload(true),
    },
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Quick Action Buttons */}
        {isExpanded && (
          <div className="flex flex-col items-end space-y-3 mb-3">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-white text-gray-900 px-3 py-1 rounded-full shadow-lg text-sm font-medium whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={() => {
                    action.action();
                    setIsExpanded(false);
                  }}
                  className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110`}
                >
                  <action.icon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          {isExpanded ? (
            <X className="w-6 h-6" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </button>

        {/* Backdrop */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-black bg-opacity-20 -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>

      {/* Quick Upload Modal */}
      <QuickUpload
        isOpen={showQuickUpload}
        onClose={() => setShowQuickUpload(false)}
        onSelectType={(type) => {
          console.log('Selected type:', type);
          setShowQuickUpload(false);
        }}
      />
    </>
  );
};

export default FloatingUploadButton;

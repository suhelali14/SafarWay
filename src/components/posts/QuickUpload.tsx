import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Camera, Video, Image, Mic, Type } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AppDispatch } from '../../lib/store';
import { toggleCreatePostModal } from '../../lib/store/postsSlice';

interface QuickUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'photo' | 'video' | 'reel' | 'story') => void;
}

const QuickUpload: React.FC<QuickUploadProps> = ({ isOpen, onClose, onSelectType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const uploadOptions = [
    {
      type: 'photo' as const,
      icon: Camera,
      title: 'Photo Post',
      description: 'Share your travel photos',
      color: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      type: 'video' as const,
      icon: Video,
      title: 'Video Post',
      description: 'Upload travel videos',
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
    },
    {
      type: 'reel' as const,
      icon: Mic,
      title: 'Reel',
      description: 'Create short travel stories',
      color: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      type: 'story' as const,
      icon: Type,
      title: 'Story',
      description: 'Share quick updates',
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
    },
  ];

  const handleFileUpload = (type: 'photo' | 'video') => {
    if (type === 'photo') {
      photoInputRef.current?.click();
    } else {
      videoInputRef.current?.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Store selected files in a way that CreatePostModal can access them
      // For now, just trigger the create post modal
      onClose();
      dispatch(toggleCreatePostModal(true));
    }
  };

  const handleOptionClick = (type: 'photo' | 'video' | 'reel' | 'story') => {
    if (type === 'photo' || type === 'video') {
      handleFileUpload(type);
    } else {
      onSelectType(type);
      onClose();
      dispatch(toggleCreatePostModal(true));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Post
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 p-2">
            {uploadOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleOptionClick(option.type)}
                className={`p-6 rounded-xl border-2 border-transparent ${option.bgColor} transition-all hover:scale-105 hover:shadow-md group`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full ${option.color} text-white group-hover:scale-110 transition-transform`}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${option.textColor}`}>{option.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleFileUpload('photo')}
              >
                <Image className="w-4 h-4 mr-2" />
                Upload from Gallery
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  onClose();
                  dispatch(toggleCreatePostModal(true));
                }}
              >
                <Type className="w-4 h-4 mr-2" />
                Write Something
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};

export default QuickUpload;

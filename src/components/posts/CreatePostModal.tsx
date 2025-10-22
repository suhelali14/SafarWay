import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Camera, MapPin, Image, Video, Hash } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { RootState, AppDispatch } from '../../lib/store';
import { createPost, fetchEligiblePackages } from '../../lib/store/postsSlice';
import api from '../../lib/axios';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { eligiblePackages = [], eligiblePackagesLoading, createPostLoading } = useSelector(
    (state: RootState) => state.posts
  );

  const [content, setContent] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(5);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  React.useEffect(() => {
    // Only fetch once when modal opens if we haven't already fetched and have no packages
    if (isOpen && !hasInitialized.current && (!eligiblePackages || eligiblePackages.length === 0) && !eligiblePackagesLoading) {
      hasInitialized.current = true;
      dispatch(fetchEligiblePackages());
    }
    
    // Reset when modal closes
    if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [isOpen, dispatch]); // Only depend on isOpen and dispatch

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Limit to 10 files
    const newFiles = [...selectedFiles, ...files].slice(0, 10);
    setSelectedFiles(newFiles);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 10));
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace('#', '');
    if (tag && !hashtags.includes(tag) && hashtags.length < 10) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addHashtag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !selectedPackage) return;

    // Require at least one media file
    if (selectedFiles.length === 0) {
      console.error('At least one media file is required');
      return;
    }

    const selectedBooking = Array.isArray(eligiblePackages) 
      ? eligiblePackages.find((pkg: any) => (pkg.id || pkg.bookingId) === selectedPackage)
      : null;

    if (!selectedBooking) {
      console.error('Selected booking not found');
      return;
    }

    try {
      // Step 1: Upload files to get URLs
      const uploadFormData = new FormData();
      selectedFiles.forEach((file) => {
        uploadFormData.append('files', file);
      });
      
      console.log('Uploading files...');
      const uploadResponse = await api.post('/uploads/media', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const mediaUrls = uploadResponse.data.urls || uploadResponse.data.data?.urls || [];
      
      if (!Array.isArray(mediaUrls) || mediaUrls.length === 0) {
        throw new Error('Failed to upload media files');
      }

      // Determine post type based on media
      let postType = 'PHOTO';
      if (selectedFiles.length > 1) {
        postType = 'CAROUSEL';
      } else if (selectedFiles.length === 1) {
        const file = selectedFiles[0];
        if (file.type.startsWith('video/')) {
          postType = 'REEL';
        }
      }

      // Step 2: Create post with uploaded URLs
      const postData = {
        type: postType,
        caption: content,
        bookingId: selectedBooking.id,
        agencyId: selectedBooking.agencyId,
        tourPackageId: selectedBooking.tourPackageId,
        mediaUrls: mediaUrls,
        ...(location && { location }),
        ...(hashtags.length > 0 && { hashtags }),
        rating: rating
      };

      console.log('Creating post with data:', postData);
      await dispatch(createPost(postData)).unwrap();
      
      // Reset form
      setContent('');
      setSelectedPackage('');
      setLocation('');
      setHashtags([]);
      setHashtagInput('');
      setSelectedFiles([]);
      setPreviews([]);
      setRating(5);
      
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      // You might want to show a user-friendly error message here
    }
  };

  const selectedPackageData = Array.isArray(eligiblePackages) 
    ? eligiblePackages.find((pkg: any) => (pkg.id || pkg.bookingId) === selectedPackage)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Share Your Travel Experience
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Selection */}
          <div className="space-y-2">
            <Label htmlFor="package">Select Package *</Label>
            <Select value={selectedPackage} onValueChange={setSelectedPackage}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a package you've traveled with" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(eligiblePackages) && eligiblePackages.map((pkg: any) => (
                  <SelectItem key={pkg.id || pkg.bookingId} value={pkg.id || pkg.bookingId}>
                    <div className="flex flex-col">
                      <span className="font-medium">{pkg.tourPackage.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {pkg.agency.name} • Completed: {new Date(pkg.endDate || pkg.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPackageData && (
              <p className="text-sm text-muted-foreground">
                Share your experience from this amazing trip!
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Your Experience *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your travel story, highlights, tips, or memories..."
              className="min-h-[120px] resize-none"
              maxLength={2000}
            />
            <p className="text-sm text-muted-foreground text-right">
              {content.length}/2000
            </p>
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Photos & Videos</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <Image className="w-8 h-8 text-gray-400" />
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Click to upload photos and videos
                </p>
                <p className="text-xs text-gray-500">
                  Up to 10 files • Max 50MB per file
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* File Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add a location"
                className="pl-10"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <div className="space-y-2">
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="hashtags"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Add hashtags (press Enter or Space to add)"
                  className="pl-10"
                />
                {hashtagInput.trim() && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={addHashtag}
                    className="absolute right-2 top-1 h-8"
                  >
                    Add
                  </Button>
                )}
              </div>
              
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeHashtag(tag)}
                    >
                      #{tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Maximum 10 hashtags • Click on a hashtag to remove it
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createPostLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!content.trim() || !selectedPackage || selectedFiles.length === 0 || createPostLoading}
              className="min-w-[100px]"
            >
              {createPostLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </div>
              ) : (
                'Share Post'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

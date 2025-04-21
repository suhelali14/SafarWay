import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface EditProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profileImage: '',
  });
  
  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size and type
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Mock upload process
    setIsUploading(true);
    
    // Read file as data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileData(prev => ({
        ...prev,
        profileImage: result,
      }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  // Remove profile image
  const removeProfileImage = () => {
    setProfileData(prev => ({
      ...prev,
      profileImage: '',
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and profile picture
            </DialogDescription>
          </DialogHeader>
          
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                <AvatarImage src={profileData.profileImage} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {profileData.profileImage && (
                <button 
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full p-1"
                  onClick={removeProfileImage}
                  aria-label="Remove profile picture"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="profile-image" className="block text-center text-sm font-medium mb-2">
                Profile Picture
              </Label>
              <div className="flex items-center justify-center">
                <label 
                  htmlFor="profile-image" 
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </label>
                <Input 
                  id="profile-image" 
                  name="profileImage" 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={profileData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profileData.email} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={profileData.phone} 
                onChange={handleChange}
                placeholder="(Optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address" 
                value={profileData.address} 
                onChange={handleChange}
                placeholder="(Optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={profileData.bio} 
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
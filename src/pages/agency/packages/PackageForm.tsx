import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { useToast } from '../../../hooks/use-toast';
import { CalendarIcon, Loader2, X, PlusCircle } from 'lucide-react';
import { PackageStatus, TourType, Package } from '../../../services/api/packageService';
import { useAuth } from '../../../contexts/AuthContext';
import { cn } from '../../../lib/utils';
import { Calendar } from '../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { format } from 'date-fns';
import { packageService } from '../../../services/api/packageService';

interface PackageFormProps {
  initialData?: Package;
  onSubmit?: (data: Partial<Package>) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function PackageForm({ initialData, onSubmit, isLoading = false, isEdit = false }: PackageFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<Package>>({
    title: '',
    description: '',
    price: 0,
    duration: 1,
    
    destination: '',
    minCapacity: 1,
    maxPeople: 10,
    maxGroupSize: 10,
    tourType: 'ADVENTURE' as TourType,
    status: 'DRAFT' as PackageStatus,
    images: [],
    inclusions: [],
    exclusions: [],
    phoneNumber: '',
    email: '',
    whatsapp: '',
    cancellationPolicy: '',
    additionalInfo: '',
    startDate: '',
    endDate: '',
    ...initialData,
  });

  const [validFrom, setValidFrom] = useState<Date | undefined>(
    initialData?.validFrom ? new Date(initialData.validFrom) : undefined
  );
  const [validTill, setValidTill] = useState<Date | undefined>(
    initialData?.validTill ? new Date(initialData.validTill) : undefined
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startDate ? new Date(initialData.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endDate ? new Date(initialData.endDate) : undefined
  );
  const [inclusion, setInclusion] = useState<string>('');
  const [exclusion, setExclusion] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverImagePreview, setCoverImagePreview] = useState<string | undefined>(initialData?.coverImage);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const agencyId = user?.agency?.id || '';

  // Update form data when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
      if (initialData.validFrom) {
        setValidFrom(new Date(initialData.validFrom));
      }
      if (initialData.validTill) {
        setValidTill(new Date(initialData.validTill));
      }
      if (initialData.startDate) {
        setStartDate(new Date(initialData.startDate));
      }
      if (initialData.endDate) {
        setEndDate(new Date(initialData.endDate));
      }
      if (initialData.coverImage) {
        setCoverImagePreview(initialData.coverImage);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name === 'price' || name === 'discountPrice' || name === 'duration' || 
        name === 'minCapacity' || name === 'maxPeople') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const updatedData = {
          ...formData,
          [name]: numValue,
        };
        
        // If maxPeople is changed, also update maxGroupSize
        if (name === 'maxPeople') {
          updatedData.maxGroupSize = numValue;
        }
        
        setFormData(updatedData);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleDateChange = (date: Date | undefined, field: 'validFrom' | 'validTill' | 'startDate' | 'endDate') => {
    if (field === 'validFrom') {
      setValidFrom(date);
    } else if (field === 'validTill') {
      setValidTill(date);
    } else if (field === 'startDate') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }

    if (date) {
      setFormData({
        ...formData,
        [field]: date.toISOString(),
      });
    } else {
      const updatedFormData = { ...formData };
      delete updatedFormData[field];
      setFormData(updatedFormData);
    }
  };

  // Convert file to base64 string
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingImage(true);
      // Convert to base64
      const base64String = await convertFileToBase64(file);
      
      // Update form data
      setFormData({
        ...formData,
        coverImage: base64String,
      });
      
      // Set preview
      setCoverImagePreview(base64String);
      
      toast({
        title: "Image uploaded",
        description: "Cover image has been added successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploadingImage(true);
      const filesArray = Array.from(files);
      
      // Validate file types and sizes
      for (const file of filesArray) {
        if (!file.type.includes('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive"
          });
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than 5MB`,
            variant: "destructive"
          });
          return;
        }
      }
      
      // Convert all files to base64
      const base64Promises = filesArray.map(file => convertFileToBase64(file));
      const base64Strings = await Promise.all(base64Promises);
      
      // Update form data
      const currentImages = formData.images || [];
      setFormData({
        ...formData,
        images: [...currentImages, ...base64Strings],
      });
      
      toast({
        title: "Images uploaded",
        description: `${filesArray.length} images have been added to the gallery`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    if (formData.images) {
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({
        ...formData,
        images: updatedImages,
      });
    }
  };

  const removeCoverImage = () => {
    setFormData({
      ...formData,
      coverImage: undefined,
    });
    setCoverImagePreview(undefined);
  };

  const addInclusion = () => {
    if (!inclusion.trim()) return;
    
    const updatedInclusions = [...(formData.inclusions || []), inclusion.trim()];
    setFormData({
      ...formData,
      inclusions: updatedInclusions,
    });
    setInclusion('');
    
    // Clear error
    if (errors.inclusions) {
      setErrors({
        ...errors,
        inclusions: '',
      });
    }
  };

  const removeInclusion = (index: number) => {
    if (formData.inclusions) {
      const updatedInclusions = [...formData.inclusions];
      updatedInclusions.splice(index, 1);
      setFormData({
        ...formData,
        inclusions: updatedInclusions,
      });
    }
  };

  const addExclusion = () => {
    if (!exclusion.trim()) return;
    
    const updatedExclusions = [...(formData.exclusions || []), exclusion.trim()];
    setFormData({
      ...formData,
      exclusions: updatedExclusions,
    });
    setExclusion('');
    
    // Clear error
    if (errors.exclusions) {
      setErrors({
        ...errors,
        exclusions: '',
      });
    }
  };

  const removeExclusion = (index: number) => {
    if (formData.exclusions) {
      const updatedExclusions = [...formData.exclusions];
      updatedExclusions.splice(index, 1);
      setFormData({
        ...formData,
        exclusions: updatedExclusions,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Package title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.destination?.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.price === undefined || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.duration === undefined || formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 day';
    }

    if (formData.minCapacity === undefined || formData.minCapacity < 1) {
      newErrors.minCapacity = 'Minimum capacity must be at least 1';
    }

    if (formData.maxPeople === undefined || formData.maxPeople < formData.minCapacity!) {
      newErrors.maxPeople = 'Maximum people must be greater than or equal to minimum capacity';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.inclusions || formData.inclusions.length === 0) {
      newErrors.inclusions = 'At least one inclusion is required';
    }

    if (!formData.exclusions || formData.exclusions.length === 0) {
      newErrors.exclusions = 'At least one exclusion is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form validation passed, agencyId:', agencyId);
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (!agencyId) {
      toast({
        title: "Error",
        description: "Agency ID is required to save the package",
        variant: "destructive"
      });
      return;
    }

    console.log('Form validation passed, agencyId:', agencyId);
    setIsSubmitting(true);

    // Prepare data for submission
    const submissionData = { ...formData };
    
    // Map fields to match backend schema exactly
    submissionData.maxGroupSize = formData.maxPeople || 10;
    submissionData.minimumAge = formData.minCapacity || 1;
    submissionData.pricePerPerson = formData.price || 0;
    // Use price field for discount price (in backend price is optional and used for discount)
    if (formData.discountPrice) {
      submissionData.price = formData.discountPrice;
    }
    // Map inclusions/exclusions to includedItems/excludedItems
    submissionData.includedItems = formData.inclusions;
    submissionData.excludedItems = formData.exclusions;
    // Handle cancellation policy field with different spelling
    if (formData.cancellationPolicy) {
      submissionData.cancelationPolicy = formData.cancellationPolicy;
    }
    
    // Keep destination field for backward compatibility
    // The backend will create and manage the destinations relation
    if (formData.destination) {
      submissionData.destination = formData.destination;
    }
    
    // Remove validFrom and validTill fields as they're not in the database schema yet
    delete submissionData.validFrom;
    delete submissionData.validTill;
    
    console.log('Submitting package data:', submissionData);
    
    // For large image data, we might need to compress or limit the debugging output
    if (submissionData.coverImage && submissionData.coverImage.length > 1000) {
      console.log('Cover image size:', submissionData.coverImage.length, 'bytes');
    }
    
    if (submissionData.images && submissionData.images.length > 0) {
      // Map images to galleryImages
      submissionData.galleryImages = submissionData.images;
      console.log('Gallery images count:', submissionData.images.length);
    }

    try {
      if (onSubmit) {
        // Use the provided onSubmit if available
        await onSubmit(submissionData);
      } else {
        // Handle directly in the form
        if (isEdit && initialData?.id) {
          // Update existing package
          console.log('Updating existing package with ID:', initialData.id);
          const result = await packageService.updatePackage(agencyId, initialData.id, submissionData);
          console.log("Update API response:", result);
          toast({
            title: "Success",
            description: "Package updated successfully"
          });
        } else {
          // Create new package
          console.log('Creating new package for agency:', agencyId);
          const result = await packageService.createPackage(agencyId, submissionData);
          console.log("Create API response:", result);
          toast({
            title: "Success",
            description: "Package created successfully"
          });
        }
        // Navigate back to packages list
        navigate('/agency/packages');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Error",
        description: typeof error === 'string' 
          ? error 
          : "There was an error saving the package. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Package Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Enter package title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination || ''}
              onChange={handleChange}
              placeholder="Enter destination"
              className={errors.destination ? 'border-red-500' : ''}
            />
            {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe your package (minimum 10 characters)"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tourType">Package Type *</Label>
            <Select
              value={formData.tourType}
              onValueChange={(value) => handleSelectChange(value, 'tourType')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADVENTURE">Adventure</SelectItem>
                <SelectItem value="CULTURAL">Cultural</SelectItem>
                <SelectItem value="WILDLIFE">Wildlife</SelectItem>
                <SelectItem value="BEACH">Beach</SelectItem>
                <SelectItem value="MOUNTAIN">Mountain</SelectItem>
                <SelectItem value="CITY">City</SelectItem>
                <SelectItem value="CRUISE">Cruise</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange(value, 'status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Price & Duration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discountPrice">Discount Price ($)</Label>
            <Input
              id="discountPrice"
              name="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.discountPrice || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (Days) *</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration || ''}
              onChange={handleChange}
              placeholder="1"
              className={errors.duration ? 'border-red-500' : ''}
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                    errors.startDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => handleDateChange(date, 'startDate')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                    errors.endDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => handleDateChange(date, 'endDate')}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="validFrom">Valid From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !validFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validFrom ? format(validFrom, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={validFrom}
                  onSelect={(date) => handleDateChange(date, 'validFrom')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="validTill">Valid Till</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !validTill && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {validTill ? format(validTill, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={validTill}
                  onSelect={(date) => handleDateChange(date, 'validTill')}
                  initialFocus
                  disabled={(date) => validFrom ? date < validFrom : false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Inclusions & Exclusions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="inclusions">Inclusions *</Label>
            <div className="flex gap-2">
              <Input
                id="inclusion"
                value={inclusion}
                onChange={(e) => setInclusion(e.target.value)}
                placeholder="Add an inclusion"
                className={errors.inclusions ? 'border-red-500' : ''}
              />
              <Button type="button" onClick={addInclusion}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            {errors.inclusions && <p className="text-red-500 text-sm">{errors.inclusions}</p>}
            
            {formData.inclusions && formData.inclusions.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {formData.inclusions.map((item, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{item}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeInclusion(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No inclusions added yet</p>
            )}
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="exclusions">Exclusions *</Label>
            <div className="flex gap-2">
              <Input
                id="exclusion"
                value={exclusion}
                onChange={(e) => setExclusion(e.target.value)}
                placeholder="Add an exclusion"
                className={errors.exclusions ? 'border-red-500' : ''}
              />
              <Button type="button" onClick={addExclusion}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            {errors.exclusions && <p className="text-red-500 text-sm">{errors.exclusions}</p>}
            
            {formData.exclusions && formData.exclusions.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {formData.exclusions.map((item, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{item}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeExclusion(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No exclusions added yet</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Capacity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minCapacity">Minimum Capacity *</Label>
            <Input
              id="minCapacity"
              name="minCapacity"
              type="number"
              min="1"
              value={formData.minCapacity || ''}
              onChange={handleChange}
              placeholder="1"
              className={errors.minCapacity ? 'border-red-500' : ''}
            />
            {errors.minCapacity && <p className="text-red-500 text-sm">{errors.minCapacity}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPeople">Maximum People *</Label>
            <Input
              id="maxPeople"
              name="maxPeople"
              type="number"
              min="1"
              value={formData.maxPeople || ''}
              onChange={handleChange}
              placeholder="10"
              className={errors.maxPeople ? 'border-red-500' : ''}
            />
            {errors.maxPeople && <p className="text-red-500 text-sm">{errors.maxPeople}</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="contact@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp || ''}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
            <Textarea
              id="cancellationPolicy"
              name="cancellationPolicy"
              value={formData.cancellationPolicy || ''}
              onChange={handleChange}
              placeholder="Describe your cancellation policy"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo || ''}
              onChange={handleChange}
              placeholder="Any other information travelers should know"
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Images</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image</Label>
            <Input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              disabled={uploadingImage}
            />
            <p className="text-sm text-gray-500">Recommended size: 1200x800 pixels, Max size: 5MB</p>
            
            {uploadingImage && <p className="text-blue-500 text-sm mt-2">Uploading image...</p>}
            
            {coverImagePreview && (
              <div className="mt-4 relative group">
                <img 
                  src={coverImagePreview} 
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gallery">Gallery Images</Label>
            <Input
              id="gallery"
              name="gallery"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesUpload}
              disabled={uploadingImage}
            />
            <p className="text-sm text-gray-500">You can select multiple images (Max size per image: 5MB)</p>
          </div>
          
          {formData.images && formData.images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Gallery Images ({formData.images.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(-1)}
          disabled={isLoading || isSubmitting || uploadingImage}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || isSubmitting || uploadingImage}>
          {(isLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {uploadingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
} 
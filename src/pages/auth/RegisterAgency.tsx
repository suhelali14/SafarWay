import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agencyRegistrationSchema } from '../../lib/validations/auth';
import { useDispatch, useSelector } from 'react-redux';
import { registerAgency } from '../../lib/store/slices/authSlice';
import { RootState } from '../../lib/store';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ui/use-toast';
import { Loader2, Check, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

type AgencyRegistrationFormData = {
  agencyName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logo?: FileList;
  galleryImages?: FileList;
  termsAccepted: boolean;
};

const steps = [
  { id: 'info', title: 'Agency Info' },
  { id: 'media', title: 'Media' },
  { id: 'terms', title: 'Terms & Conditions' },
];

export default function RegisterAgencyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewGallery, setPreviewGallery] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AgencyRegistrationFormData>({
    resolver: zodResolver(agencyRegistrationSchema),
    defaultValues: {
      agencyName: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      termsAccepted: false,
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('logo', e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setValue('galleryImages', files);
      const newPreviews: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setPreviewGallery(newPreviews);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: AgencyRegistrationFormData) => {
    if (currentStep < steps.length - 1) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('agencyName', data.agencyName);
      formData.append('description', data.description);
      formData.append('contactEmail', data.contactEmail);
      formData.append('contactPhone', data.contactPhone);
      formData.append('address', data.address);
      
      if (data.logo?.[0]) {
        formData.append('logo', data.logo[0]);
      }
      
      if (data.galleryImages) {
        for (let i = 0; i < data.galleryImages.length; i++) {
          formData.append('galleryImages', data.galleryImages[i]);
        }
      }

      await dispatch(registerAgency(formData)).unwrap();
      toast({
        title: 'Success',
        description: 'Your agency account has been created successfully',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error || 'Failed to register. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                placeholder="Enter your agency name"
                {...register('agencyName')}
                className={errors.agencyName ? 'border-red-500' : ''}
              />
              {errors.agencyName && (
                <p className="text-sm text-red-500">{errors.agencyName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your agency"
                {...register('description')}
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="Enter contact email"
                {...register('contactEmail')}
                className={errors.contactEmail ? 'border-red-500' : ''}
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="Enter contact phone"
                {...register('contactPhone')}
                className={errors.contactPhone ? 'border-red-500' : ''}
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter agency address"
                {...register('address')}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Agency Logo</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                {previewLogo ? (
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={previewLogo}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewLogo(null);
                        setValue('logo', undefined);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="logo"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input
                          id="logo"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="galleryImages">Gallery Images</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                {previewGallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {previewGallery.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Gallery preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPreviews = [...previewGallery];
                            newPreviews.splice(index, 1);
                            setPreviewGallery(newPreviews);
                            
                            // Update form data
                            const dt = new DataTransfer();
                            const input = document.querySelector('input[type=file]') as HTMLInputElement;
                            const { files } = input;
                            
                            if (files) {
                              for (let i = 0; i < files.length; i++) {
                                if (i !== index) {
                                  dt.items.add(files[i]);
                                }
                              }
                            }
                            
                            input.files = dt.files;
                            setValue('galleryImages', dt.files);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label
                        htmlFor="galleryImages"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload files</span>
                        <input
                          id="galleryImages"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Terms and Conditions</h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 max-h-40 overflow-y-auto">
                <p>
                  By registering your agency, you agree to our Terms of Service and
                  Privacy Policy. We collect and process your agency data in
                  accordance with our Privacy Policy.
                </p>
                <p className="mt-2">
                  You are responsible for maintaining the confidentiality of your
                  agency account and ensuring that all information provided is
                  accurate and up-to-date.
                </p>
                <p className="mt-2">
                  SafarWay reserves the right to verify your agency information and
                  may request additional documentation at any time.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  {...register('termsAccepted')}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I agree to the Terms and Conditions
                </Label>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-red-500">
                  {errors.termsAccepted.message}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title="Register your agency"
      subtitle="Join SafarWay as a travel agency"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center',
                index < steps.length - 1 ? 'flex-1' : ''
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2',
                  index <= currentStep
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 text-gray-500'
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 flex-1 mx-2',
                    index < currentStep ? 'bg-primary' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm">
          {steps.map((step) => (
            <span key={step.id} className="text-gray-500">
              {step.title}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between pt-4">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting || loading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <Button
            type="submit"
            className={cn('ml-auto', currentStep === 0 && 'w-full')}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {currentStep === steps.length - 1 ? 'Creating account...' : 'Loading...'}
              </>
            ) : currentStep === steps.length - 1 ? (
              'Create Agency Account'
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
} 
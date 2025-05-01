import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerRegistrationSchema } from '../../lib/validations/auth';
import { useDispatch, useSelector } from 'react-redux';
 // Ensure this file exists or update the path
import { registerCustomer } from '../../lib/store/slices/authSlice';
import { AppDispatch, RootState } from '../../lib/store';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import { Loader2, Check, ChevronRight, ChevronLeft, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

type CustomerRegistrationFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address?: string;
  profileImage?: FileList;
  termsAccepted: boolean;
};

const steps = [
  { id: 'basic', title: 'Basic Info' },
  { id: 'contact', title: 'Contact Info' },
  { id: 'profile', title: 'Profile Picture' },
  { id: 'terms', title: 'Terms & Conditions' },
];

export default function RegisterCustomerPage() {

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CustomerRegistrationFormData>({
    resolver: zodResolver(customerRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      termsAccepted: false,
    },
  });

  const password = watch('password');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profileImage', e.target.files || undefined);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const onSubmit = async (data: CustomerRegistrationFormData) => {
    if (currentStep < steps.length - 1) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('phone', data.phone);
      if (data.address) formData.append('address', data.address);
      if (data.profileImage?.[0]) {
        formData.append('profileImage', data.profileImage[0]);
      }

      await dispatch(registerCustomer(formData)).unwrap();
      toast({
        title: 'Success',
        description: 'Your account has been created successfully',
      });
      navigate('/');
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              {password && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full">
                    <div
                      className={cn(
                        'h-1 rounded-full',
                        password.length < 8
                          ? 'bg-red-500 w-1/4'
                          : password.length < 12
                          ? 'bg-yellow-500 w-1/2'
                          : 'bg-green-500 w-full'
                      )}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password strength:{' '}
                    {password.length < 8
                      ? 'Weak'
                      : password.length < 12
                      ? 'Medium'
                      : 'Strong'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                placeholder="Enter your address"
                {...register('address')}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Picture (Optional)</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                {previewImage ? (
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setValue('profileImage', undefined);
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
                        htmlFor="profileImage"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input
                          id="profileImage"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
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
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Terms and Conditions</h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 max-h-40 overflow-y-auto">
                <p>
                  By creating an account, you agree to our Terms of Service and
                  Privacy Policy. We collect and process your personal data in
                  accordance with our Privacy Policy.
                </p>
                <p className="mt-2">
                  You are responsible for maintaining the confidentiality of your
                  account and password. You agree to accept responsibility for all
                  activities that occur under your account.
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
      title="Create your account"
      subtitle="Join SafarWay to start your journey"
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
              'Create Account'
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
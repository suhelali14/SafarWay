import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '../../services/api';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';

// Password validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SetNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isInviteFlow, setIsInviteFlow] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    // Extract token or user ID from URL params
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const tempUserId = searchParams.get('userId');
    
    if (token) {
      setInviteToken(token);
      setIsInviteFlow(true);
      // Verify invitation token
      verifyInviteToken(token);
    } else if (tempUserId) {
      setUserId(tempUserId);
      setIsInviteFlow(false);
      // Get user email or other details if needed
      const email = searchParams.get('email');
      if (email) setUserEmail(email);
    } else {
      // No token or user ID - redirect to login
      toast({
        title: 'Error',
        description: 'Invalid password reset request',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [location, navigate, toast]);

  const verifyInviteToken = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.verifyInviteToken(token);
      // If verification successful, set user email for display
      if (response.data && response.data.email) {
        setUserEmail(response.data.email);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      toast({
        title: 'Error',
        description: 'Invalid or expired invitation link',
        variant: 'destructive',
      });
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      if (isInviteFlow && inviteToken) {
        // Accept invitation with new password
        await authAPI.acceptInvitation(inviteToken, data.password);
        toast({
          title: 'Success',
          description: 'Your account has been activated. You can now log in.',
        });
        navigate('/login');
      } else if (userId) {
        // Set new password for existing user (temp password flow)
        await authAPI.setNewPassword(userId, data.password);
        toast({
          title: 'Success',
          description: 'Your password has been changed. You can now log in with your new password.',
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to set new password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    switch (strength) {
      case 1: return { text: 'Very Weak', color: 'bg-red-500', width: 'w-1/5' };
      case 2: return { text: 'Weak', color: 'bg-orange-500', width: 'w-2/5' };
      case 3: return { text: 'Medium', color: 'bg-yellow-500', width: 'w-3/5' };
      case 4: return { text: 'Strong', color: 'bg-lime-500', width: 'w-4/5' };
      case 5: return { text: 'Very Strong', color: 'bg-green-500', width: 'w-full' };
      default: return { text: 'Very Weak', color: 'bg-red-500', width: 'w-1/5' };
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-muted-foreground">
          {isInviteFlow
            ? "You've been invited to join SafarWay. Create a password to complete your registration."
            : "Create a new password for your account."}
        </p>
        {userEmail && (
          <p className="font-medium mt-2">
            Email: {userEmail}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            {passwordStrength && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password strength: {passwordStrength.text}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Set New Password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
} 
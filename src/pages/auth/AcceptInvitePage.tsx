import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Logo } from '../../components/common/Logo';

// Form schema
const inviteFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  phone: z.string().optional(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [inviteData, setInviteData] = useState<{ email?: string; role?: string } | null>(null);

  // Form setup
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Verify token when component mounts
  useEffect(() => {
    if (!token) {
      setTokenError('Invalid invitation link. Token is missing.');
      return;
    }

    // Decode token to display info (this is safe as JWT is signed on server)
    try {
      // Try to decode the token to get some basic info
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        setInviteData({
          email: payload.email,
          role: payload.role,
        });
      }
      setTokenVerified(true);
    } catch (error) {
      console.error("Error decoding token:", error);
      setTokenError('Invalid invitation token.');
    }
  }, [token]);

  const onSubmit = async (data: InviteFormValues) => {
    if (!token) {
      toast.error('Invalid invitation token');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/agency/users/onboard`, {
        token,
        name: data.name,
        phone: data.phone,
        password: data.password,
      });

      toast.success('Registration completed successfully!');
      
      // Store token and user data
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Redirect to appropriate dashboard based on role
      const role = response.data.data.user.role;
      let dashboardPath = '/';
      
      if (role === 'SAFARWAY_ADMIN' || role === 'SAFARWAY_USER') {
        dashboardPath = '/admin/dashboard';
      } else if (role === 'AGENCY_ADMIN' || role === 'AGENCY_USER') {
        dashboardPath = '/agency/dashboard';
      }
      
      navigate(dashboardPath);
    } catch (error: any) {
      console.error('Onboarding error:', error);
      const errorMessage = error.response?.data?.message || 'Error completing registration';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Accept Invitation | SafarWay</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 flex flex-col items-center">
            <Logo className="h-12 mb-4" />
            <CardTitle className="text-2xl font-bold">Complete Your Registration</CardTitle>
            <CardDescription>
              {inviteData?.email ? (
                <>You've been invited to join SafarWay as <strong className="capitalize">{(inviteData.role || '').replace('_', ' ').toLowerCase()}</strong></>
              ) : (
                'Set up your account to join SafarWay'
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {tokenError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <h3 className="font-medium">Error</h3>
                <p>{tokenError}</p>
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 234 567 8901" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-4" 
                    disabled={loading}
                  >
                    {loading ? 'Completing Registration...' : 'Complete Registration'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500">
              Already have an account? <a href="/login" className="text-primary font-medium">Login</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
} 
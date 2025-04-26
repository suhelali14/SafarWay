import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';

import { Mail, Lock, User, X } from 'lucide-react';

type ActionType = 'subscribe' | 'book' | 'like' | 'review';

const actionMessages = {
  subscribe: {
    title: 'Subscribe to Agency Updates',
    description: 'Login or register to subscribe to this agency and get notified about their latest packages and offers.'
  },
  book: {
    title: 'Book Your Adventure',
    description: 'Login or register to book this exciting package and secure your spot!'
  },
  like: {
    title: 'Like This Content',
    description: 'Login or register to like this content and show your appreciation.'
  },
  review: {
    title: 'Share Your Experience',
    description: 'Login or register to write a review and help others discover great travel experiences.'
  }
};

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  actionType: ActionType;
}

export function LoginRequiredModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  actionType 
}: LoginRequiredModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, register } = useAuth();

  // Login form state
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerCredentials, setRegisterCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call your auth login function
      await login(loginCredentials.email, loginCredentials.password);
      toast({
        title: "Success!",
        description: "You've successfully logged in.",
        variant: "default",
      });
      onLoginSuccess();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password confirmation check
    if (registerCredentials.password !== registerCredentials.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call your auth register function
      await register(
        registerCredentials.name,
        registerCredentials.email,
        registerCredentials.password,
        'CUSTOMER'
      );
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
        variant: "default",
      });
      onLoginSuccess();
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an issue creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const actionMessage = actionMessages[actionType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{actionMessage.title}</DialogTitle>
          <DialogDescription>
            {actionMessage.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="w-full pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={loginCredentials.email}
                    onChange={(e) => setLoginCredentials({...loginCredentials, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginCredentials.password}
                    onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="name"
                    placeholder="John Doe"
                    className="pl-10"
                    value={registerCredentials.name}
                    onChange={(e) => setRegisterCredentials({...registerCredentials, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="register-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={registerCredentials.email}
                    onChange={(e) => setRegisterCredentials({...registerCredentials, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registerCredentials.password}
                    onChange={(e) => setRegisterCredentials({...registerCredentials, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={registerCredentials.confirmPassword}
                    onChange={(e) => setRegisterCredentials({...registerCredentials, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-4">
          <p className="text-sm text-gray-500">
            {activeTab === 'login' ? 
              "Don't have an account? " : 
              "Already have an account? "}
            <Button 
              variant="link" 
              className="h-auto p-0 text-sm"
              onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            >
              {activeTab === 'login' ? 'Register' : 'Login'}
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
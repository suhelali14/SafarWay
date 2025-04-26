import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../components/ui/use-toast';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';

export default function AcceptInvitation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [_userEmail, setUserEmail] = useState('');
  const [_userName, setUserName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyInvitation = async () => {
      try {
        // Extract token from URL
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (!token) {
          setError('Invalid invitation link. No token provided.');
          setIsLoading(false);
          return;
        }

        // Verify the token with the API
        const response = await authAPI.verifyInviteToken(token);
        
        if (response.data) {
          setUserEmail(response.data.email);
          setUserName(response.data.name);
          // Redirect to the set password page
          navigate(`/auth/set-new-password?token=${token}`);
        } else {
          setError('Invalid or expired invitation.');
        }
      } catch (error) {
        console.error('Error verifying invitation:', error);
        setError('Invalid or expired invitation. Please contact your administrator.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyInvitation();
  }, [location, navigate, toast]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-center text-lg">Verifying your invitation...</p>
          </>
        ) : error ? (
          <>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
              <h3 className="text-red-800 font-semibold">Invitation Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
            <Button 
              onClick={() => navigate('/login')} 
              className="mt-4"
            >
              Return to Login
            </Button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Invitation Accepted!</h2>
            <p className="text-center text-gray-600">
              Redirecting you to set your password...
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
} 
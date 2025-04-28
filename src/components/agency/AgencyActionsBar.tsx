import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agencyApi } from '../../lib/api/agency';
import { Mail, Bookmark, BookmarkX, Flag } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

interface AgencyActionsBarProps {
  agencyId: string;
  onContact: () => void;
  onReport: () => void;
}

export function AgencyActionsBar({ 
  agencyId, 
  onContact, 
  onReport 
}: AgencyActionsBarProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Check if agency is bookmarked
  const { data: bookmarkData, isLoading: isLoadingBookmark } = useQuery({
    queryKey: ['agencyBookmarked', agencyId],
    queryFn: () => agencyApi.isBookmarked(agencyId).then(res => res.data),
    enabled: isAuthenticated
  });
  
  const isBookmarked = bookmarkData?.bookmarked || false;
  
  // Toggle bookmark mutation
  const { mutate: toggleBookmark, status: toggleBookmarkStatus } = useMutation({
    mutationFn: () => agencyApi.toggleBookmark(agencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agencyBookmarked', agencyId] });
      toast.success({
        title: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
        description: isBookmarked 
          ? 'This agency has been removed from your bookmarks.'
          : 'This agency has been added to your bookmarks.',
      });
    },
    onError: () => {
      toast.error({
        title: 'Action failed',
        description: 'Failed to update bookmark status. Please try again.',
      });
    },
  });
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    if (!isAuthenticated) {
      toast.error({
        title: 'Authentication required',
        description: 'Please login to bookmark this agency.',
      });
      return;
    }

    toggleBookmark();
  };
  
  // Handle contact click
  const handleContactClick = () => {
    onContact();
  };
  
  // Handle report click
  const handleReportClick = () => {
    if (!isAuthenticated) {
      toast.error({
        title: 'Authentication required',
        description: 'Please login to report this agency.',
      });
      return;
    }
    
    onReport();
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-3 px-4 z-10">
      <div className="container mx-auto flex justify-center gap-3">
        <Button 
          variant="default"
          className="gap-2"
          onClick={handleContactClick}
        >
          <Mail className="h-4 w-4" />
          <span>Contact Agency</span>
        </Button>
        
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleBookmarkToggle}
          disabled={!isAuthenticated || isLoadingBookmark || toggleBookmarkStatus === 'pending'}
        >
          {isBookmarked ? (
            <>
              <BookmarkX className="h-4 w-4" />
              <span>Remove Bookmark</span>
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              <span>Bookmark Agency</span>
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={handleReportClick}
        >
          <Flag className="h-4 w-4" />
          <span>Report</span>
        </Button>
      </div>
    </div>
  );
}
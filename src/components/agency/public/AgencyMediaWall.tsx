import { useState, useEffect } from 'react';
import { Image, Video, MessageCircle, Calendar, Heart, ExternalLink } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { agencyPublicService, MediaItem } from '../../../services/api/agencyPublicService';
import { motion } from 'framer-motion';

interface AgencyMediaWallProps {
  agencyId: string;
}

const AgencyMediaWall = ({ agencyId }: AgencyMediaWallProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch media on initial load
  useEffect(() => {
    fetchMedia(1, true);
  }, [agencyId]);

  const fetchMedia = async (pageNum: number, reset: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await agencyPublicService.getAgencyMedia(agencyId, pageNum, 12);
      
      setMedia(prev => (reset ? response.media : [...prev, ...response.media]));
      setTotalItems(response.pagination.total);
      setPage(pageNum);
      setHasMore(pageNum < response.pagination.pages);
    } catch (err) {
      console.error('Error fetching agency media:', err);
      setError('Failed to load media. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchMedia(page + 1, false);
    }
  };

  const handleLikeToggle = async (mediaItem: MediaItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to like media",
        variant: "destructive"
      });
      return;
    }

    try {
      let response;
      if (mediaItem.hasUserLiked) {
        response = await agencyPublicService.unlikeMediaItem(agencyId, mediaItem.id);
      } else {
        response = await agencyPublicService.likeMediaItem(agencyId, mediaItem.id);
      }

      // Update the media item with new like count
      setMedia(prev => 
        prev.map(item => 
          item.id === mediaItem.id 
            ? { 
                ...item, 
                likes: response.likes,
                hasUserLiked: !item.hasUserLiked 
              } 
            : item
        )
      );

      if (selectedMedia?.id === mediaItem.id) {
        setSelectedMedia(prev => 
          prev ? { 
            ...prev, 
            likes: response.likes,
            hasUserLiked: !prev.hasUserLiked 
          } : null
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  const openMediaDialog = (item: MediaItem) => {
    setSelectedMedia(item);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="w-4 h-4" />;
      case 'ANNOUNCEMENT':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && media.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => fetchMedia(1, true)}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No media content available</p>
        <p className="text-sm text-gray-400 mt-2">
          This agency hasn't uploaded any photos or videos yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {media.map((item) => (
          <motion.div 
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden cursor-pointer group">
              <div 
                className="relative h-48 overflow-hidden"
                onClick={() => openMediaDialog(item)}
              >
                {item.type === 'VIDEO' ? (
                  <div className="relative h-full">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-white/80 rounded-full p-2">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <img 
                      src={item.url}
                      alt={item.caption || 'Agency video thumbnail'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <img 
                    src={item.url}
                    alt={item.caption || 'Agency media'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                
                <Badge 
                  variant="outline" 
                  className="absolute top-2 left-2 bg-white/80 flex items-center gap-1"
                >
                  {getMediaTypeIcon(item.type)}
                  {item.type}
                </Badge>
              </div>
              
              <CardContent className="p-3">
                {item.caption && (
                  <p className="text-sm line-clamp-2 mb-2">
                    {item.caption}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.createdAt)}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={() => handleLikeToggle(item)}
                  >
                    <Heart 
                      className={`w-4 h-4 ${item.hasUserLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                    <span className="ml-1 text-xs">{item.likes}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {hasMore && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
      
      {/* Media Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMedia?.type === 'ANNOUNCEMENT' ? 'Announcement' : 'Media'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedMedia?.type === 'VIDEO' ? (
              <div className="relative pt-[56.25%]">
                <iframe 
                  src={selectedMedia.url} 
                  className="absolute inset-0 w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img 
                src={selectedMedia?.url} 
                alt={selectedMedia?.caption || 'Agency media'}
                className="w-full rounded-lg"
              />
            )}
            
            {selectedMedia?.caption && (
              <p className="text-gray-700">
                {selectedMedia.caption}
              </p>
            )}
            
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {selectedMedia && formatDate(selectedMedia.createdAt)}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => selectedMedia && handleLikeToggle(selectedMedia)}
                >
                  <Heart 
                    className={`w-4 h-4 ${selectedMedia?.hasUserLiked ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  <span>{selectedMedia?.likes || 0}</span>
                </Button>
                
                {selectedMedia?.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href={selectedMedia.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgencyMediaWall; 
import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Star, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';

interface UserReviewsProps {
  data: any[];
  isLoading: boolean;
}

export function UserReviews({ data, isLoading }: UserReviewsProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>(data || []);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [editedText, setEditedText] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };
  
  // Edit a review
  const startEditingReview = (review: any) => {
    setEditingReview(review);
    setEditedText(review.text);
    setIsEditDialogOpen(true);
  };
  
  // Save edited review
  const saveEditedReview = () => {
    setReviews(prev => 
      prev.map(review => 
        review.id === editingReview.id 
          ? { ...review, text: editedText } 
          : review
      )
    );
    
    toast({
      title: "Review updated",
      description: "Your review has been successfully updated.",
    });
    
    setIsEditDialogOpen(false);
  };
  
  // Delete a review
  const confirmDeleteReview = (review: any) => {
    setEditingReview(review);
    setIsDeleteDialogOpen(true);
  };
  
  const deleteReview = () => {
    setReviews(prev => prev.filter(review => review.id !== editingReview.id));
    
    toast({
      title: "Review deleted",
      description: "Your review has been successfully deleted.",
    });
    
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter>
              <div className="flex justify-end w-full gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reviews Written</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't written any reviews yet. Reviews help other travelers and improve the community.
            </p>
            <Button>
              Browse Past Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.packageImage || review.tourPackage?.coverImage} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.packageName?.charAt(0) || review.tourPackage?.title?.charAt(0) || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {review.packageName || review.tourPackage?.title}
                      </CardTitle>
                      <CardDescription>
                        {review.agencyName || review.tourPackage?.agency?.name}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:justify-end">
                    {renderStars(review.rating)}
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
                
                {review.response && (
                  <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={review.response.logo || review.tourPackage?.agency?.logo} />
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                          {review.response.agencyName?.charAt(0) || review.tourPackage?.agency?.name?.charAt(0) || 'R'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {review.response.agencyName || review.tourPackage?.agency?.name} responded:
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.response.text}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex justify-end w-full gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => startEditingReview(review)}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => confirmDeleteReview(review)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Your Review</DialogTitle>
            <DialogDescription>
              Update your review for {editingReview?.packageName || editingReview?.tourPackage?.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center gap-1 py-4">
            {editingReview && renderStars(editingReview.rating)}
            <span className="ml-2">
              ({editingReview?.rating || 0}/5)
            </span>
          </div>
          
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Share your experience..."
            className="min-h-[120px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedReview}>
              Save Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Review Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your review for {editingReview?.packageName || editingReview?.tourPackage?.title}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteReview}>
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 
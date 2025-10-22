import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MapPin,
  Star,
  MoreHorizontal,
  User,
  Flag,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { RootState, AppDispatch } from '../../lib/store';
import {
  togglePostLike,
  togglePostSave,
  deletePost,
  toggleCommentsVisibility,
} from '../../lib/store/postsSlice';
import { Post } from '../../types/post';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { showComments } = useSelector((state: RootState) => state.posts);
  
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = user?.id === post.userId;
  const showCommentsForPost = showComments[post.id] || false;
  const contentLimit = 150;
  const shouldTruncate = (post.caption || '').length > contentLimit;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await dispatch(togglePostLike(post.id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await dispatch(togglePostSave(post.id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${post.user.firstName || post.user.name}'s travel post`,
        text: (post.caption || '').slice(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(post.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const toggleComments = () => {
    dispatch(toggleCommentsVisibility(post.id));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatHashtags = (content: string) => {
    return content.split(' ').map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index} className="text-blue-600 hover:underline cursor-pointer">
            {word}{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.user.profileImage || post.user.profilePicture} />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {post.user.firstName || post.user.name} {post.user.lastName || ''}
              </h3>
              {post.user.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwner ? (
              <>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>
                  <Flag className="w-4 h-4 mr-2" />
                  Report Post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Package Info */}
      {post.package && (
        <div className="px-4 pb-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">{post.package.name}</h4>
                <p className="text-sm text-blue-700">{post.package.agency.name}</p>
              </div>
              {post.rating && (
                <div className="flex items-center gap-1">
                  {renderStars(post.rating)}
                  <span className="text-sm text-gray-600 ml-1">({post.rating}/5)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="grid grid-cols-1 gap-1">
          {post.media.map((media, index) => (
            <div key={media.id || index} className="relative">
              {media.type === 'IMAGE' ? (
                <img
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full max-h-96 object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  poster={media.thumbnailUrl}
                  controls
                  className="w-full max-h-96 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3">
        <div className="text-gray-900 whitespace-pre-wrap">
          {shouldTruncate && !showFullContent ? (
            <>
              {formatHashtags((post.caption || '').slice(0, contentLimit))}
              <button
                onClick={() => setShowFullContent(true)}
                className="text-blue-600 hover:underline ml-1"
              >
                ... see more
              </button>
            </>
          ) : (
            formatHashtags(post.caption || '')
          )}
          {shouldTruncate && showFullContent && (
            <button
              onClick={() => setShowFullContent(false)}
              className="text-blue-600 hover:underline ml-1"
            >
              show less
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                post.isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </button>

            <button
              onClick={toggleComments}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">{post.sharesCount}</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`p-2 rounded-full transition-all ${
              post.isSaved
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showCommentsForPost && (
        <div className="border-t p-4">
          <div className="text-center text-gray-500">
            Comments coming soon...
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

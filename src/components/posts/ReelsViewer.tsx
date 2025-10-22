import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreVertical,
  Play,
  Volume2,
  VolumeX,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  user: {
    id: string;
    name: string;
    profileImage?: string;
    verified?: boolean;
  };
  content: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

interface ReelsViewerProps {
  reels: Reel[];
  initialReelIndex?: number;
  onClose: () => void;
}

const ReelsViewer: React.FC<ReelsViewerProps> = ({ 
  reels, 
  initialReelIndex = 0, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialReelIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      // Auto-advance to next reel
      if (currentIndex < reels.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(0); // Loop back to first
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, reels.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying, currentIndex]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = () => {
    // Implement like functionality
    console.log('Like reel:', currentReel.id);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Save reel:', currentReel.id);
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${currentReel.user.name}'s travel reel`,
        url: window.location.href,
      });
    }
  };

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleSwipe('down');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleSwipe('up');
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length, isPlaying]);

  if (!currentReel) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white bg-opacity-30 z-10">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Video Container */}
      <div className="relative w-full h-full max-w-md mx-auto bg-black">
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          poster={currentReel.thumbnailUrl}
          className="w-full h-full object-cover"
          loop={false}
          muted={isMuted}
          playsInline
          onClick={togglePlayPause}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="p-4 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-20 right-4 flex flex-col items-center space-y-4 z-10">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`p-3 rounded-full transition-all ${
              currentReel.isLiked 
                ? 'text-red-500 bg-white bg-opacity-20' 
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-current' : ''}`} />
          </button>
          <span className="text-white text-sm font-medium">{currentReel.likesCount}</span>

          {/* Comment */}
          <button className="p-3 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-all">
            <MessageCircle className="w-6 h-6" />
          </button>
          <span className="text-white text-sm font-medium">{currentReel.commentsCount}</span>

          {/* Share */}
          <button 
            onClick={handleShare}
            className="p-3 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-all"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <span className="text-white text-sm font-medium">{currentReel.sharesCount}</span>

          {/* Save */}
          <button
            onClick={handleSave}
            className={`p-3 rounded-full transition-all ${
              currentReel.isSaved 
                ? 'text-yellow-500 bg-white bg-opacity-20' 
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${currentReel.isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* More */}
          <button className="p-3 rounded-full text-white hover:bg-white hover:bg-opacity-20 transition-all">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 right-20 z-10">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-12 h-12 border-2 border-white">
              <AvatarImage src={currentReel.user.profileImage} />
              <AvatarFallback className="bg-gray-600 text-white">
                {currentReel.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{currentReel.user.name}</span>
                {currentReel.user.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              {currentReel.location && (
                <span className="text-white text-sm opacity-80">{currentReel.location}</span>
              )}
            </div>
            <Button size="sm" variant="outline" className="ml-auto text-black">
              Follow
            </Button>
          </div>

          {/* Content */}
          <p className="text-white text-sm leading-relaxed max-w-xs">
            {currentReel.content}
          </p>
        </div>

        {/* Volume Control */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all z-10"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Navigation Hints */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-xs opacity-50">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
              ↑
            </div>
            <span>Swipe up</span>
          </div>
        </div>

        <div className="absolute bottom-1/2 left-4 transform translate-y-1/2 text-white text-xs opacity-50">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
              ↓
            </div>
            <span>Swipe down</span>
          </div>
        </div>
      </div>

      {/* Reel Counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {reels.length}
      </div>
    </div>
  );
};

export default ReelsViewer;

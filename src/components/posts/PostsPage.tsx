import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, TrendingUp, Search, Filter, Compass, Home, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RootState, AppDispatch } from '../../lib/store';
import { toggleCreatePostModal } from '../../lib/store/postsSlice';
import PostFeed from './PostFeed';
import CreatePostModal from './CreatePostModal';
import ExplorePage from './ExplorePage';
import FloatingUploadButton from './FloatingUploadButton';
import ReelsViewer from './ReelsViewer';

const PostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showCreatePostModal } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState('feed');
  const [showReels, setShowReels] = useState(false);

  const handleCreatePost = () => {
    dispatch(toggleCreatePostModal(true));
  };

  const handleCloseModal = () => {
    dispatch(toggleCreatePostModal(false));
  };

  // Mock reels data for demonstration
  const mockReels = [
    {
      id: '1',
      videoUrl: '/api/placeholder/video/300x400',
      thumbnailUrl: '/api/placeholder/300/400',
      duration: 45,
      user: {
        id: '1',
        name: 'Sarah Johnson',
        profileImage: '/api/placeholder/50/50',
        verified: true,
      },
      content: 'Amazing sunset at Bali! 🌅 This place is absolutely magical. Can\'t wait to come back! #bali #sunset #travel',
      location: 'Bali, Indonesia',
      likesCount: 1234,
      commentsCount: 89,
      sharesCount: 156,
      isLiked: false,
      isSaved: false,
      createdAt: '2024-01-15T10:30:00Z',
    },
    // Add more mock reels as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with Navigation */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Travel Stories</h1>
              <Button onClick={handleCreatePost} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Share Story
              </Button>
            </div>
            
            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Feed
                </TabsTrigger>
                <TabsTrigger value="explore" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Explore
                </TabsTrigger>
                <TabsTrigger value="reels" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Reels
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content based on active tab */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Feed Tab */}
          <TabsContent value="feed" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search posts..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleCreatePost}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('explore')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Explore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('reels')}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Watch Reels
                    </Button>
                  </div>
                </div>

                {/* User Stats */}
                {user && (
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Your Activity</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posts shared</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Likes received</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Comments</span>
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Popular Hashtags */}
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Trending Hashtags</h3>
                  <div className="space-y-2">
                    {['#Adventure', '#Beach', '#Mountains', '#Culture', '#Food'].map((hashtag) => (
                      <button
                        key={hashtag}
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {hashtag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feed */}
              <div className="lg:col-span-3">
                <PostFeed />
              </div>
            </div>
          </TabsContent>

          {/* Explore Tab */}
          <TabsContent value="explore" className="mt-0">
            <ExplorePage />
          </TabsContent>

          {/* Reels Tab */}
          <TabsContent value="reels" className="mt-0">
            <div className="p-4">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Watch Travel Reels</h2>
                <p className="text-gray-600 mb-6">
                  Discover amazing travel experiences through short videos
                </p>
                <Button
                  onClick={() => setShowReels(true)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Start Watching
                </Button>
              </div>

              {/* Reels Grid Preview */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setShowReels(true)}
                    className="relative aspect-[9/16] bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden cursor-pointer group"
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Filter className="w-6 h-6 text-gray-800 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 text-white text-xs">
                      <div className="font-medium">Travel Reel #{index + 1}</div>
                      <div className="opacity-75">2.1k views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Upload Button */}
        <FloatingUploadButton />

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showCreatePostModal}
          onClose={handleCloseModal}
        />

        {/* Reels Viewer */}
        {showReels && (
          <ReelsViewer
            reels={mockReels}
            onClose={() => setShowReels(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PostsPage;

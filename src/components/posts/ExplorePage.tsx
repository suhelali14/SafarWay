import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Users,
  Play,
  Grid3X3,
  Heart,
  MessageCircle,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RootState, AppDispatch } from '../../lib/store';
import { searchPosts, fetchTrendingHashtags } from '../../lib/store/postsSlice';
import PostCard from './PostCard';

const ExplorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { search, trendingHashtags, trendingHashtagsLoading } = useSelector(
    (state: RootState) => state.posts
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only fetch once on mount if we haven't initialized
    if (!hasInitialized.current && trendingHashtags.length === 0 && !trendingHashtagsLoading) {
      hasInitialized.current = true;
      dispatch(fetchTrendingHashtags(20));
    }
  }, [dispatch]); // Only depend on dispatch

  const handleSearch = (query: string) => {
    if (query.trim()) {
      dispatch(searchPosts({ 
        query: query.trim(), 
        type: activeTab === 'all' ? undefined : activeTab,
        page: 1, 
        limit: 20 
      }));
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    setSearchQuery(hashtag);
    handleSearch(hashtag);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (searchQuery.trim()) {
      dispatch(searchPosts({ 
        query: searchQuery, 
        type: tab === 'all' ? undefined : tab,
        page: 1, 
        limit: 20 
      }));
    }
  };

  // Mock data for demonstration
  const trendingDestinations = [
    { name: 'Bali, Indonesia', posts: 1250, image: '/api/placeholder/300/200' },
    { name: 'Paris, France', posts: 980, image: '/api/placeholder/300/200' },
    { name: 'Tokyo, Japan', posts: 875, image: '/api/placeholder/300/200' },
    { name: 'New York, USA', posts: 760, image: '/api/placeholder/300/200' },
  ];

  const recentReels = [
    { id: '1', thumbnail: '/api/placeholder/200/300', duration: '0:45', likes: 234, views: 1250 },
    { id: '2', thumbnail: '/api/placeholder/200/300', duration: '1:20', likes: 567, views: 2100 },
    { id: '3', thumbnail: '/api/placeholder/200/300', duration: '0:30', likes: 123, views: 890 },
    { id: '4', thumbnail: '/api/placeholder/200/300', duration: '2:15', likes: 890, views: 3400 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search destinations, experiences, hashtags..."
                className="pl-12 pr-12"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    // Clear search results
                  }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <Input placeholder="Any destination" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <Input placeholder="Any time" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Type
                    </label>
                    <Input placeholder="All types" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Apply Filters</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="reel" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Reels
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending
              </TabsTrigger>
            </TabsList>

            {/* All Posts Tab */}
            <TabsContent value="all" className="space-y-6">
              {search.posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {search.posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-200 relative">
                        {post.media && post.media[0] && (
                          <img
                            src={post.media[0].url}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-1">
                              <Heart className="w-5 h-5" />
                              <span>{post.likesCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-5 h-5" />
                              <span>{post.commentsCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Trending Destinations */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Trending Destinations</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trendingDestinations.map((destination, index) => (
                          <div
                            key={index}
                            className="relative rounded-lg overflow-hidden cursor-pointer group"
                          >
                            <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all" />
                            <div className="absolute bottom-4 left-4 text-white">
                              <h3 className="font-semibold text-lg">{destination.name}</h3>
                              <p className="text-sm opacity-90">{destination.posts} posts</p>
                            </div>
                            <div className="absolute top-4 right-4">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Reels */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Reels</h2>
                        <Button variant="outline" size="sm">View All</Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recentReels.map((reel) => (
                          <div
                            key={reel.id}
                            className="relative rounded-lg overflow-hidden cursor-pointer group aspect-[9/16]"
                          >
                            <div className="w-full h-full bg-gradient-to-br from-pink-400 to-red-500" />
                            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all" />
                            
                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-gray-800 ml-1" />
                              </div>
                            </div>
                            
                            {/* Duration */}
                            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              {reel.duration}
                            </div>
                            
                            {/* Stats */}
                            <div className="absolute bottom-2 left-2 text-white text-xs">
                              <div className="flex items-center gap-1 mb-1">
                                <Heart className="w-3 h-3" />
                                <span>{reel.likes}</span>
                              </div>
                              <div className="opacity-75">{reel.views} views</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Trending Hashtags */}
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Trending Hashtags</h3>
                      <div className="space-y-2">
                        {trendingHashtags.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleHashtagClick(item.hashtag)}
                            className="block w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-blue-600">#{item.hashtag}</div>
                            <div className="text-sm text-gray-500">{item.count} posts</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Suggested for You */}
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Suggested for You</h3>
                      <div className="space-y-3">
                        {['Beach Adventures', 'Mountain Hiking', 'City Tours', 'Food Experiences'].map((suggestion, index) => (
                          <button
                            key={index}
                            className="block w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{suggestion}</div>
                            <div className="text-sm text-gray-500">Based on your activity</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photo">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {search.posts.filter(post => post.type === 'PHOTO' || post.type === 'CAROUSEL').map((post) => (
                  <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                    {post.media && post.media[0] && (
                      <img
                        src={post.media[0].url}
                        alt="Photo"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Reels Tab */}
            <TabsContent value="reel">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {recentReels.map((reel) => (
                  <div
                    key={reel.id}
                    className="relative rounded-lg overflow-hidden cursor-pointer group aspect-[9/16]"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-pink-400 to-red-500" />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-gray-800 ml-1" />
                      </div>
                    </div>
                    
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {reel.duration}
                    </div>
                    
                    <div className="absolute bottom-2 left-2 text-white text-xs">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{reel.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Trending Tab */}
            <TabsContent value="trending">
              <div className="space-y-6">
                {search.posts.length > 0 ? (
                  search.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trendingDestinations.map((destination, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm border overflow-hidden"
                      >
                        <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500" />
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900">{destination.name}</h3>
                          <p className="text-gray-600">{destination.posts} posts this week</p>
                          <Button className="mt-3" size="sm">Explore</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

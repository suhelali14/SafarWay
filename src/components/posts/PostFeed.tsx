import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../lib/store';
import { fetchFeed } from '../../lib/store/postsSlice';
import PostCard from './PostCard';
import { Button } from '../ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

const PostFeed: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feed } = useSelector((state: RootState) => state.posts);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only fetch once on mount if we haven't initialized and have no posts
    if (!hasInitialized.current && feed.posts.length === 0 && !feed.loading) {
      hasInitialized.current = true;
      dispatch(fetchFeed({ page: 1, limit: 10 }));
    }
  }, [dispatch]); // Only depend on dispatch

  const loadMore = useCallback(() => {
    if (!feed.loading && feed.hasMore) {
      dispatch(fetchFeed({ page: feed.page + 1, limit: 10 }));
    }
  }, [dispatch, feed.loading, feed.hasMore, feed.page]);

  const refresh = useCallback(() => {
    dispatch(fetchFeed({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (feed.posts.length === 0 && feed.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading posts...
        </div>
      </div>
    );
  }

  if (feed.posts.length === 0 && !feed.loading) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">
              Be the first to share your travel experience! Posts will appear here once you or others
              start sharing.
            </p>
          </div>
          <Button onClick={refresh} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          onClick={refresh}
          variant="outline"
          size="sm"
          disabled={feed.loading}
          className="mb-4"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${feed.loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </Button>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {feed.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load More */}
      {feed.hasMore && (
        <div className="flex justify-center py-6">
          <Button
            onClick={loadMore}
            disabled={feed.loading}
            variant="outline"
            className="min-w-[120px]"
          >
            {feed.loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* Error State */}
      {feed.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading posts</h3>
              <p className="text-sm text-red-700 mt-1">{feed.error}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button onClick={refresh} size="sm" variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFeed;

import api from '../axios';
import { Post, PostComment, PostCollection, EligiblePackage } from '../../types/post';

export const postApi = {
  // Upload media files
  uploadMedia: (files: FormData) =>
    api.post('/uploads/media', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Get eligible packages for posting
  getEligiblePackages: () =>
    api.get<EligiblePackage[]>('/posts/eligible-bookings'),

  // Create a new post
  // Create a new post
  createPost: (data: any) =>
    api.post<Post>('/posts', data),

  // Get posts feed
  getFeed: (page: number = 1, limit: number = 10) =>
    api.get<{ data: Post[]; total: number; hasMore: boolean }>('/posts/feed', {
      params: { page, limit }
    }),

  // Get posts by user
  getUserPosts: (userId: string, page: number = 1, limit: number = 10) =>
    api.get<{ data: Post[]; total: number; hasMore: boolean }>(`/posts/user/${userId}`, {
      params: { page, limit }
    }),

  // Get posts by agency
  getAgencyPosts: (agencyId: string, page: number = 1, limit: number = 10) =>
    api.get<{ data: Post[]; total: number; hasMore: boolean }>(`/posts/agency/${agencyId}`, {
      params: { page, limit }
    }),

  // Get posts by tour package
  getPackagePosts: (packageId: string, page: number = 1, limit: number = 10) =>
    api.get<{ data: Post[]; total: number; hasMore: boolean }>(`/posts/package/${packageId}`, {
      params: { page, limit }
    }),

  // Get single post
  getPost: (postId: string) =>
    api.get<Post>(`/posts/${postId}`),

  // Like/Unlike post
  toggleLike: (postId: string) =>
    api.post(`/posts/${postId}/like`),

  // Save/Unsave post
  toggleSave: (postId: string) =>
    api.post(`/posts/${postId}/save`),

  // Share post
  sharePost: (postId: string, platform?: string) =>
    api.post(`/posts/${postId}/share`, { platform }),

  // Report post
  reportPost: (postId: string, reason: string, description?: string) =>
    api.post(`/posts/${postId}/report`, { reason, description }),

  // Delete post
  deletePost: (postId: string) =>
    api.delete(`/posts/${postId}`),

  // Update post
  updatePost: (postId: string, data: Partial<any>) =>
    api.put<Post>(`/posts/${postId}`, data),

  // Get post likes
  getPostLikes: (postId: string, page: number = 1, limit: number = 20) =>
    api.get(`/posts/${postId}/likes`, { params: { page, limit } }),

  // Comments API
  comments: {
    // Get comments for a post
    getComments: (postId: string, page: number = 1, limit: number = 10) =>
      api.get<{ data: PostComment[]; total: number; hasMore: boolean }>(`/posts/comments/${postId}`, {
        params: { page, limit }
      }),

    // Add comment
    addComment: (postId: string, content: string, parentCommentId?: string) =>
      api.post<PostComment>(`/posts/${postId}/comments`, {
        content,
        parentCommentId
      }),

    // Update comment
    updateComment: (commentId: string, content: string) =>
      api.put<PostComment>(`/comments/${commentId}`, { content }),

    // Delete comment
    deleteComment: (commentId: string) =>
      api.delete(`/comments/${commentId}`),

    // Like/Unlike comment
    toggleCommentLike: (commentId: string) =>
      api.post(`/comments/${commentId}/like`),

    // Report comment
    reportComment: (commentId: string, reason: string, description?: string) =>
      api.post(`/comments/${commentId}/report`, { reason, description }),

    // Get comment replies
    getReplies: (commentId: string, page: number = 1, limit: number = 10) =>
      api.get<{ data: PostComment[]; total: number; hasMore: boolean }>(`/comments/${commentId}/replies`, {
        params: { page, limit }
      }),
  },

  // Collections API
  collections: {
    // Get user collections
    getUserCollections: (userId?: string, page: number = 1, limit: number = 10) =>
      api.get<{ data: PostCollection[]; total: number; hasMore: boolean }>('/posts/collections', {
        params: { userId, page, limit }
      }),

    // Create collection
    createCollection: (data: { name: string; description?: string; isPublic: boolean }) =>
      api.post<PostCollection>('/posts/collections', data),

  collections: {
    // Get user collections
    getUserCollections: () =>
      api.get('/posts/collections/user'),

    // Create collection
    createCollection: (data: { name: string; description?: string; isPrivate?: boolean }) =>
      api.post('/posts/collections', data),

    // Update collection
    updateCollection: (collectionId: string, data: { name?: string; description?: string; isPrivate?: boolean }) =>
      api.put(`/posts/collections/${collectionId}`, data),

    // Delete collection
    deleteCollection: (collectionId: string) =>
      api.delete(`/posts/collections/${collectionId}`),

    // Get collection posts
    getCollectionPosts: (collectionId: string, page: number = 1, limit: number = 10) =>
      api.get(`/posts/collections/${collectionId}/posts`, {
        params: { page, limit }
      }),

    // Add post to collection
    addPostToCollection: (collectionId: string, postId: string) =>
      api.post('/posts/collections/add-post', { collectionId, postId }),

    // Remove post from collection
    removePostFromCollection: (collectionId: string, postId: string) =>
      api.delete('/posts/collections/remove-post', {
        data: { collectionId, postId }
      }),
  },
  },

  // Search and Discovery
  search: {
    // Search posts
    searchPosts: (query: string, type?: string, page: number = 1, limit: number = 10) =>
      api.get<{ data: Post[]; total: number; hasMore: boolean }>('/posts/search', {
        params: { q: query, type, page, limit }
      }),

    // Get trending hashtags
    getTrendingHashtags: (limit: number = 20) =>
      api.get<{ hashtag: string; count: number }[]>('/posts/hashtags/popular', {
        params: { limit }
      }),

    // Get posts by hashtag
    getPostsByHashtag: (hashtag: string, page: number = 1, limit: number = 10) =>
      api.get<{ data: Post[]; total: number; hasMore: boolean }>(`/posts/hashtag/${hashtag}`, {
        params: { page, limit }
      }),

    // Get posts by location
    getPostsByLocation: (location: string, page: number = 1, limit: number = 10) =>
      api.get<{ data: Post[]; total: number; hasMore: boolean }>('/posts/location', {
        params: { location, page, limit }
      }),
  },

  // Analytics (for user insights)
  analytics: {
    // Get post analytics
    getPostAnalytics: (postId: string) =>
      api.get(`/posts/${postId}/analytics`),

    // Get user post analytics
    getUserPostAnalytics: (timeframe: 'week' | 'month' | 'year' = 'month') =>
      api.get('/posts/analytics/user', { params: { timeframe } }),
  },
};

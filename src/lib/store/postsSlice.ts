import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostComment, PostCollection, EligiblePackage } from '../../types/post';
import { postApi } from '../api/posts';

// Async thunks
export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await postApi.getFeed(page, limit);
    return response.data;
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async ({ userId, page, limit }: { userId: string; page: number; limit: number }) => {
    const response = await postApi.getUserPosts(userId, page, limit);
    return response.data;
  }
);

export const fetchEligiblePackages = createAsyncThunk(
  'posts/fetchEligiblePackages',
  async () => {
    const response = await postApi.getEligiblePackages();
    // Handle both direct array response and wrapped response
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return [];
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: any) => {
    const response = await postApi.createPost(postData);
    return response.data;
  }
);

export const togglePostLike = createAsyncThunk(
  'posts/toggleLike',
  async (postId: string) => {
    await postApi.toggleLike(postId);
    return postId;
  }
);

export const togglePostSave = createAsyncThunk(
  'posts/toggleSave',
  async (postId: string) => {
    await postApi.toggleSave(postId);
    return postId;
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string) => {
    await postApi.deletePost(postId);
    return postId;
  }
);

export const fetchPostComments = createAsyncThunk(
  'posts/fetchComments',
  async ({ postId, page, limit }: { postId: string; page: number; limit: number }) => {
    const response = await postApi.comments.getComments(postId, page, limit);
    return { postId, ...response.data };
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content, parentCommentId }: { postId: string; content: string; parentCommentId?: string }) => {
    const response = await postApi.comments.addComment(postId, content, parentCommentId);
    return response.data;
  }
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async ({ query, type, page, limit }: { query: string; type?: string; page: number; limit: number }) => {
    const response = await postApi.search.searchPosts(query, type, page, limit);
    return response.data;
  }
);

export const fetchTrendingHashtags = createAsyncThunk(
  'posts/fetchTrendingHashtags',
  async (limit: number = 20) => {
    const response = await postApi.search.getTrendingHashtags(limit);
    return response.data;
  }
);

interface PostsState {
  // Feed
  feed: {
    posts: Post[];
    hasMore: boolean;
    loading: boolean;
    error: string | null;
    page: number;
  };
  
  // User posts
  userPosts: {
    [userId: string]: {
      posts: Post[];
      hasMore: boolean;
      loading: boolean;
      page: number;
    };
  };
  
  // Search
  search: {
    posts: Post[];
    hasMore: boolean;
    loading: boolean;
    error: string | null;
    query: string;
    page: number;
  };
  
  // Single post
  currentPost: Post | null;
  currentPostLoading: boolean;
  
  // Comments
  comments: {
    [postId: string]: {
      comments: PostComment[];
      hasMore: boolean;
      loading: boolean;
      page: number;
    };
  };
  
  // Collections
  collections: PostCollection[];
  collectionsLoading: boolean;
  
  // Eligible packages for posting
  eligiblePackages: EligiblePackage[];
  eligiblePackagesLoading: boolean;
  
  // Trending hashtags
  trendingHashtags: { hashtag: string; count: number }[];
  trendingHashtagsLoading: boolean;
  
  // Create post
  createPostLoading: boolean;
  createPostError: string | null;
  
  // UI State
  selectedPostId: string | null;
  showCreatePostModal: boolean;
  showComments: { [postId: string]: boolean };
}

const initialState: PostsState = {
  feed: {
    posts: [],
    hasMore: true,
    loading: false,
    error: null,
    page: 1,
  },
  userPosts: {},
  search: {
    posts: [],
    hasMore: true,
    loading: false,
    error: null,
    query: '',
    page: 1,
  },
  currentPost: null,
  currentPostLoading: false,
  comments: {},
  collections: [],
  collectionsLoading: false,
  eligiblePackages: [],
  eligiblePackagesLoading: false,
  trendingHashtags: [],
  trendingHashtagsLoading: false,
  createPostLoading: false,
  createPostError: null,
  selectedPostId: null,
  showCreatePostModal: false,
  showComments: {},
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<string | null>) => {
      state.selectedPostId = action.payload;
    },
    toggleCreatePostModal: (state, action: PayloadAction<boolean>) => {
      state.showCreatePostModal = action.payload;
    },
    toggleCommentsVisibility: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.showComments[postId] = !state.showComments[postId];
    },
    clearSearch: (state) => {
      state.search = {
        posts: [],
        hasMore: true,
        loading: false,
        error: null,
        query: '',
        page: 1,
      };
    },
    resetFeed: (state) => {
      state.feed = {
        posts: [],
        hasMore: true,
        loading: false,
        error: null,
        page: 1,
      };
    },
    clearCreatePostError: (state) => {
      state.createPostError = null;
    },
    updatePostInFeed: (state, action: PayloadAction<Post>) => {
      const updatedPost = action.payload;
      
      // Update in feed
      const feedIndex = state.feed.posts.findIndex(p => p.id === updatedPost.id);
      if (feedIndex !== -1) {
        state.feed.posts[feedIndex] = updatedPost;
      }
      
      // Update in user posts
      Object.keys(state.userPosts).forEach(userId => {
        const userPostIndex = state.userPosts[userId].posts.findIndex(p => p.id === updatedPost.id);
        if (userPostIndex !== -1) {
          state.userPosts[userId].posts[userPostIndex] = updatedPost;
        }
      });
      
      // Update in search results
      const searchIndex = state.search.posts.findIndex(p => p.id === updatedPost.id);
      if (searchIndex !== -1) {
        state.search.posts[searchIndex] = updatedPost;
      }
      
      // Update current post
      if (state.currentPost?.id === updatedPost.id) {
        state.currentPost = updatedPost;
      }
    },
    removePostFromState: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      
      // Remove from feed
      state.feed.posts = state.feed.posts.filter(p => p.id !== postId);
      
      // Remove from user posts
      Object.keys(state.userPosts).forEach(userId => {
        state.userPosts[userId].posts = state.userPosts[userId].posts.filter(p => p.id !== postId);
      });
      
      // Remove from search results
      state.search.posts = state.search.posts.filter(p => p.id !== postId);
      
      // Clear current post if it's the deleted one
      if (state.currentPost?.id === postId) {
        state.currentPost = null;
      }
      
      // Remove comments
      delete state.comments[postId];
      delete state.showComments[postId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feed
      .addCase(fetchFeed.pending, (state) => {
        state.feed.loading = true;
        state.feed.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed.loading = false;
        if (action.meta.arg.page === 1) {
          state.feed.posts = action.payload.data;
        } else {
          state.feed.posts.push(...action.payload.data);
        }
        state.feed.hasMore = action.payload.hasMore;
        state.feed.page = action.meta.arg.page;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feed.loading = false;
        state.feed.error = action.error.message || 'Failed to fetch feed';
      })
      
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state, action) => {
        const userId = action.meta.arg.userId;
        if (!state.userPosts[userId]) {
          state.userPosts[userId] = {
            posts: [],
            hasMore: true,
            loading: false,
            page: 1,
          };
        }
        state.userPosts[userId].loading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        const page = action.meta.arg.page;
        
        if (page === 1) {
          state.userPosts[userId].posts = action.payload.data;
        } else {
          state.userPosts[userId].posts.push(...action.payload.data);
        }
        state.userPosts[userId].hasMore = action.payload.hasMore;
        state.userPosts[userId].loading = false;
        state.userPosts[userId].page = page;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        const userId = action.meta.arg.userId;
        if (state.userPosts[userId]) {
          state.userPosts[userId].loading = false;
        }
      })
      
      // Fetch Eligible Packages
      .addCase(fetchEligiblePackages.pending, (state) => {
        state.eligiblePackagesLoading = true;
      })
      .addCase(fetchEligiblePackages.fulfilled, (state, action) => {
        state.eligiblePackagesLoading = false;
        state.eligiblePackages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEligiblePackages.rejected, (state) => {
        state.eligiblePackagesLoading = false;
        state.eligiblePackages = [];
      })
      
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.createPostLoading = true;
        state.createPostError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createPostLoading = false;
        state.feed.posts.unshift(action.payload);
        state.showCreatePostModal = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createPostLoading = false;
        state.createPostError = action.error.message || 'Failed to create post';
      })
      
      // Toggle Like
      .addCase(togglePostLike.fulfilled, (state, action) => {
        const postId = action.payload;
        
        const updateLikes = (post: Post) => {
          if (post.id === postId) {
            post.isLiked = !post.isLiked;
            post.likesCount += post.isLiked ? 1 : -1;
          }
        };
        
        // Update in all places
        state.feed.posts.forEach(updateLikes);
        Object.values(state.userPosts).forEach(userPosts => {
          userPosts.posts.forEach(updateLikes);
        });
        state.search.posts.forEach(updateLikes);
        
        if (state.currentPost?.id === postId) {
          updateLikes(state.currentPost);
        }
      })
      
      // Toggle Save
      .addCase(togglePostSave.fulfilled, (state, action) => {
        const postId = action.payload;
        
        const updateSaved = (post: Post) => {
          if (post.id === postId) {
            post.isSaved = !post.isSaved;
          }
        };
        
        // Update in all places
        state.feed.posts.forEach(updateSaved);
        Object.values(state.userPosts).forEach(userPosts => {
          userPosts.posts.forEach(updateSaved);
        });
        state.search.posts.forEach(updateSaved);
        
        if (state.currentPost?.id === postId) {
          updateSaved(state.currentPost);
        }
      })
      
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        postsSlice.caseReducers.removePostFromState(state, action);
      })
      
      // Fetch Comments
      .addCase(fetchPostComments.pending, (state, action) => {
        const postId = action.meta.arg.postId;
        if (!state.comments[postId]) {
          state.comments[postId] = {
            comments: [],
            hasMore: true,
            loading: false,
            page: 1,
          };
        }
        state.comments[postId].loading = true;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        const { postId, data, hasMore } = action.payload;
        const page = action.meta.arg.page;
        
        if (page === 1) {
          state.comments[postId].comments = data;
        } else {
          state.comments[postId].comments.push(...data);
        }
        state.comments[postId].hasMore = hasMore;
        state.comments[postId].loading = false;
        state.comments[postId].page = page;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        const postId = action.meta.arg.postId;
        if (state.comments[postId]) {
          state.comments[postId].loading = false;
        }
      })
      
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const comment = action.payload;
        const postId = action.meta.arg.postId;
        
        if (state.comments[postId]) {
          if (comment.parentCommentId) {
            // It's a reply - find parent and add to replies
            const parentComment = state.comments[postId].comments.find(c => c.id === comment.parentCommentId);
            if (parentComment) {
              if (!parentComment.replies) {
                parentComment.replies = [];
              }
              parentComment.replies.push(comment);
            }
          } else {
            // It's a top-level comment
            state.comments[postId].comments.unshift(comment);
          }
        }
        
        // Update comments count in posts
        const updateCommentsCount = (post: Post) => {
          if (post.id === postId) {
            post.commentsCount += 1;
          }
        };
        
        state.feed.posts.forEach(updateCommentsCount);
        Object.values(state.userPosts).forEach(userPosts => {
          userPosts.posts.forEach(updateCommentsCount);
        });
        state.search.posts.forEach(updateCommentsCount);
        
        if (state.currentPost?.id === postId) {
          updateCommentsCount(state.currentPost);
        }
      })
      
      // Search Posts
      .addCase(searchPosts.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.search.loading = false;
        if (action.meta.arg.page === 1) {
          state.search.posts = action.payload.data;
        } else {
          state.search.posts.push(...action.payload.data);
        }
        state.search.hasMore = action.payload.hasMore;
        state.search.query = action.meta.arg.query;
        state.search.page = action.meta.arg.page;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.error.message || 'Search failed';
      })
      
      // Fetch Trending Hashtags
      .addCase(fetchTrendingHashtags.pending, (state) => {
        state.trendingHashtagsLoading = true;
      })
      .addCase(fetchTrendingHashtags.fulfilled, (state, action) => {
        state.trendingHashtagsLoading = false;
        state.trendingHashtags = action.payload;
      })
      .addCase(fetchTrendingHashtags.rejected, (state) => {
        state.trendingHashtagsLoading = false;
      });
  },
});

export const {
  setSelectedPost,
  toggleCreatePostModal,
  toggleCommentsVisibility,
  clearSearch,
  resetFeed,
  clearCreatePostError,
  updatePostInFeed,
  removePostFromState,
} = postsSlice.actions;

export default postsSlice.reducer;

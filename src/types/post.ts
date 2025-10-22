export interface PostMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnailUrl?: string;
  duration?: number;
  order: number;
}

export interface Post {
  id: string;
  content: string;
  type: 'PHOTO' | 'REEL' | 'CAROUSEL';
  caption?: string;
  mediaUrls: string[];
  media?: PostMedia[];
  thumbnailUrl?: string;
  duration?: number;
  location?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'HIDDEN' | 'REPORTED';
  isVerified: boolean;
  viewCount: number;
  shareCount: number;
  sharesCount: number;
  isEligible: boolean;
  tripCompleted: boolean;
  rating?: number;
  
  // Relations
  userId: string;
  user: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    profilePicture?: string;
    verified?: boolean;
  };
  agencyId: string;
  agency: {
    id: string;
    name: string;
    logo?: string;
  };
  tourPackageId: string;
  tourPackage: {
    id: string;
    title: string;
    destination: string;
    coverImage?: string;
  };
  package?: {
    id: string;
    name: string;
    agency: {
      id: string;
      name: string;
    };
  };
  bookingId: string;
  booking: {
    id: string;
    startDate: string;
    endDate?: string;
    status: string;
  };
  
  // Interactions
  likes: PostLike[];
  comments: PostComment[];
  saves: PostSave[];
  shares: PostShare[];
  tags: PostTag[];
  hashtags: PostHashtag[];
  
  // Current user interactions
  isLiked?: boolean;
  isSaved?: boolean;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface PostLike {
  id: string;
  userId: string;
  postId: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
}

export interface PostComment {
  id: string;
  content: string;
  status: 'ACTIVE' | 'HIDDEN' | 'REPORTED' | 'DELETED';
  likesCount: number;
  userId: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  postId: string;
  parentCommentId?: string;
  replies: PostComment[];
  likes: PostCommentLike[];
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostCommentLike {
  id: string;
  userId: string;
  commentId: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
}

export interface PostSave {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface PostShare {
  id: string;
  userId: string;
  postId: string;
  platform?: string;
  createdAt: string;
}

export interface PostTag {
  id: string;
  postId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
}

export interface PostHashtag {
  id: string;
  postId: string;
  hashtag: string;
  createdAt: string;
}

export interface CreatePostData {
  type: 'PHOTO' | 'REEL' | 'CAROUSEL';
  caption?: string;
  mediaFiles: File[];
  location?: string;
  tourPackageId: string;
  bookingId: string;
  agencyId: string;
  tags?: string[]; // User IDs to tag
  hashtags?: string[];
}

export interface PostCollection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  userId: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  posts: PostCollectionItem[];
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostCollectionItem {
  id: string;
  collectionId: string;
  postId: string;
  post: Post;
  order: number;
  createdAt: string;
}

export interface EligiblePackage {
  id: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  agencyId: string;
  userId: string;
  customerId: string;
  tourPackageId: string;
  agency: {
    id: string;
    name: string;
    logo?: string;
  };
  tourPackage: {
    id: string;
    title: string;
    destination: string;
    coverImage?: string;
  };
  _count: {
    posts: number;
  };
  hasPosted: boolean;
}

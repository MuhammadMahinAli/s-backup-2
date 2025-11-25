import { useState, useEffect, useRef } from "react";
import { MessageCircle, Image as ImageIcon, X, AlertCircle, Trash2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { HAS_CLOUDINARY } from "@/lib/uploadImage";
import { getOrCreateAnonId } from "@/lib/anon";
import { getCurrentPeerAdvocate, isAuthenticated } from "@/lib/auth";
import type { PostResponse, CommentResponse, FeedResponse, CreatePostRequest, CreateCommentRequest, DeletePostResponse, PostImage } from "@shared/api";

export default function Community() {
  // Filters
  const [sortBy, setSortBy] = useState("Most Recent");
  const [contentType, setContentType] = useState("All");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [safeMode, setSafeMode] = useState(true);

  // Post form
  const [nickname, setNickname] = useState("");
  const [postContent, setPostContent] = useState("");
  const [images, setImages] = useState<PostImage[]>([]);
  const MAX_IMAGES = 4;
  const [blurRequested, setBlurRequested] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [postError, setPostError] = useState("");
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feed data
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Comments
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentNickname, setCommentNickname] = useState("");
  const [comments, setComments] = useState<Record<string, CommentResponse[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [postingComment, setPostingComment] = useState(false);
  
  // Delete
  const [deletingPost, setDeletingPost] = useState<string | null>(null);

  // Peer Advocate
  const [isPeerAdvocate, setIsPeerAdvocate] = useState(false);
  const [peerAdvocateName, setPeerAdvocateName] = useState("");

  const topics = [
    "mental-health",
    "anxiety",
    "depression",
    "self-care",
    "support",
    "wellness",
    "relationships",
    "stress"
  ];

  // Check if logged in as peer advocate on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentPeerAdvocate();
      if (currentUser) {
        setIsPeerAdvocate(true);
        setPeerAdvocateName(currentUser.nickname);
        setCommentNickname(currentUser.nickname); // Auto-fill comment nickname
      }
    }
  }, []);

  // Load feed on mount and when filters change
  useEffect(() => {
    loadFeed();
  }, [page, sortBy, contentType, selectedTopics]);

  async function loadFeed() {
    setLoading(true);
    setFeedError("");
    
    try {
      const response = await fetch(`/api/feed?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to load feed');
      }
      
      const data: FeedResponse = await response.json();
      
      // Apply client-side filters
      let filteredPosts = data.posts;
      
      // Filter by content type
      if (contentType === "Text") {
        filteredPosts = filteredPosts.filter(p => p.contentType === "text");
      } else if (contentType === "Images") {
        filteredPosts = filteredPosts.filter(p => p.contentType === "image");
      }
      
      // Filter by topics
      if (selectedTopics.length > 0) {
        filteredPosts = filteredPosts.filter(p => 
          p.topics.some(t => selectedTopics.includes(t))
        );
      }
      
      // Sort
      if (sortBy === "Oldest") {
        filteredPosts = [...filteredPosts].reverse();
      } else if (sortBy === "Most Popular") {
        filteredPosts = [...filteredPosts].sort((a, b) => b.commentCount - a.commentCount);
      }
      
      setPosts(filteredPosts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading feed:', error);
      setFeedError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const room = MAX_IMAGES - images.length;
    const toUpload = files.slice(0, room);

    setPostError("");
    setUploading(true);

    try {
      for (const f of toUpload) {
        if (f.size > 5 * 1024 * 1024) {
          console.warn(`Skipping ${f.name}: exceeds 5MB`);
          continue;
        }
        const img = await uploadToCloudinary(f);
        setImages(prev => [...prev, img]);
      }
    } catch (err: any) {
      console.error("Cloudinary error:", err.message);
      setPostError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function removeLocalImage(publicId: string) {
    setImages(prev => prev.filter(i => i.publicId !== publicId));
  }

  async function handlePostSubmit() {
    setPostError("");
    
    // Validate
    if (!postContent.trim()) {
      setPostError("Please enter some content");
      return;
    }
    
    if (postContent.trim().length < 20) {
      setPostError("Post must be at least 20 characters");
      return;
    }
    
    if (postContent.trim().length > 1000) {
      setPostError("Post must not exceed 1000 characters");
      return;
    }

    setPosting(true);

    try {
      const postData: CreatePostRequest = {
        nickname: nickname.trim() || "Anonymous",
        text: postContent.trim(),
        images: images.length > 0 ? images : undefined,
        authorAnonId: getOrCreateAnonId(),
        blurRequested,
        topics: selectedTopics,
      };

      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Handle rate limit errors with user-friendly message
        if (response.status === 429) {
          const resetIn = error.resetIn || 0;
          const minutes = Math.floor(resetIn / 60);
          const seconds = resetIn % 60;
          const timeStr = minutes > 0 
            ? `${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`
            : `${seconds} second${seconds !== 1 ? 's' : ''}`;
          
          throw new Error(
            `Rate limit exceeded. You can create up to 5 posts every 10 minutes. Please try again in ${timeStr}.`
          );
        }
        
        throw new Error(error.error || 'Failed to create post');
      }

      const newPost: PostResponse = await response.json();
      
      // Add to top of feed
      setPosts([newPost, ...posts]);
      
      // Reset form
      setNickname("");
      setPostContent("");
      setImages([]);
      setBlurRequested(false);
      setPostError("");
      
    } catch (error) {
      console.error('Error creating post:', error);
      setPostError(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setPosting(false);
    }
  }

  async function loadComments(postId: string) {
    if (loadingComments[postId]) return;
    
    setLoadingComments({ ...loadingComments, [postId]: true });
    
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load comments');
      }
      
      const data: CommentResponse[] = await response.json();
      setComments({ ...comments, [postId]: data });
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments({ ...loadingComments, [postId]: false });
    }
  }

  function toggleComments(postId: string) {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
      if (!comments[postId]) {
        loadComments(postId);
      }
    }
  }

  async function handleCommentSubmit(postId: string) {
    if (!commentText.trim() || commentText.trim().length < 5) {
      return;
    }

    setPostingComment(true);

    try {
      const commentData: CreateCommentRequest = {
        postId,
        nickname: isPeerAdvocate ? peerAdvocateName : (commentNickname.trim() || "Anonymous"),
        text: commentText.trim(),
      };

      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newComment: CommentResponse = await response.json();
      
      // Update comments
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), newComment],
      });
      
      // Update post comment count
      setPosts(posts.map(p => 
        p._id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
      ));
      
      // Reset comment form
      setCommentText("");
      setCommentNickname("");
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setPostingComment(false);
    }
  }

  function toggleTopic(topic: string) {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  }

  function clearFilters() {
    setSortBy("Most Recent");
    setContentType("All");
    setSelectedTopics([]);
    setPage(1);
  }

  function applyFilters() {
    setPage(1);
    loadFeed();
  }

  async function handleDeletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeletingPost(postId);

    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete post');
      }

      const result: DeletePostResponse = await response.json();
      
      // Remove post from state
      setPosts(posts.filter(p => p._id !== postId));
      
      // Remove comments for this post
      const newComments = { ...comments };
      delete newComments[postId];
      setComments(newComments);
      
      // Close comment section if it was open
      if (activeCommentPost === postId) {
        setActiveCommentPost(null);
      }
      
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete post. Please try again.');
    } finally {
      setDeletingPost(null);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF7FF' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[65px] py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[62px]">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-2xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-6">
              <h2 className="font-geist font-bold text-lg text-azure-11">
                Filters
              </h2>

              {/* Sort By */}
              <div className="flex flex-col gap-2">
                <label className="font-geist font-semibold text-sm text-azure-27">
                  Sort by
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-9 px-3 pr-8 rounded-2xl border border-grey-90 bg-transparent shadow-sm appearance-none font-geist text-sm text-[#0A0A0A]"
                  >
                    <option>Most Recent</option>
                    <option>Most Popular</option>
                    <option>Oldest</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="#737373"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Content Type */}
              <div className="flex flex-col gap-2">
                <label className="font-geist font-semibold text-sm text-azure-27">
                  Content Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Text", "Images"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setContentType(type)}
                      className={`px-4 py-2 rounded-full font-geist text-sm transition-all ${
                        contentType === type
                          ? "bg-gradient-to-b from-[#89D3EE] to-[#1BB0C3] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
                          : "bg-grey-96 text-azure-27 hover:bg-grey-90"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-col gap-2">
                <label className="font-geist font-semibold text-sm text-azure-27">
                  Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-full font-geist text-xs font-medium transition-all ${
                        selectedTopics.includes(topic)
                          ? "bg-cyan-primary text-white"
                          : "bg-[rgba(133,222,242,0.2)] text-cyan-primary hover:bg-[rgba(133,222,242,0.3)]"
                      }`}
                    >
                      #{topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Mode */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-grey-95">
                <span className="font-geist font-semibold text-sm text-[#0A0A0A]">
                  Safe Mode
                </span>
                <button
                  onClick={() => setSafeMode(!safeMode)}
                  className={`relative w-8 h-[18px] rounded-full transition-colors shadow-sm ${
                    safeMode ? "bg-cyan-primary" : "bg-grey-90"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-grey-95 rounded-full transition-transform ${
                      safeMode ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Clear and Apply Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={clearFilters}
                  className="flex-1 h-9 px-4 rounded-2xl border border-grey-90 bg-transparent shadow-sm font-geist text-sm text-[#0A0A0A] hover:bg-grey-95 transition-colors"
                >
                  Clear
                </button>
                <button 
                  onClick={applyFilters}
                  className="flex-1 h-9 px-4 rounded-2xl bg-gradient-to-r from-[#88D2EE] to-[#1FB1C4] shadow-sm font-geist text-sm text-white hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Safety Tip Banner */}
            <div className="bg-gradient-to-r from-[#8BD3EF] to-[#17AFC1] rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-geist font-bold text-lg text-white mb-2">
                    Safety Tip
                  </h3>
                  <p className="font-geist text-sm text-white/90 leading-[22.75px]">
                    Remember: This is a supportive community. Be kind,
                    respectful, and mindful of others' feelings. If you're
                    experiencing a crisis, please reach out to a professional or
                    call a helpline immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Share with Community */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] flex flex-col gap-4">
              <h3 className="font-geist font-bold text-lg text-azure-11">
                Share with the Community
              </h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your nickname (optional, default: Anonymous)"
                  className="h-9 px-3 rounded-2xl border border-grey-90 bg-transparent shadow-sm font-geist text-sm placeholder:text-grey-45"
                  disabled={posting}
                />
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind? Share your thoughts, feelings, or ask for support... (20-1000 characters)"
                  className="min-h-32 p-3 rounded-2xl border border-grey-90 bg-transparent shadow-sm font-geist text-sm placeholder:text-grey-45 resize-none"
                  disabled={posting}
                  minLength={20}
                  maxLength={1000}
                />
                
                {/* Character count */}
                <div className="text-xs text-grey-45 text-right">
                  {postContent.length}/1000 characters {postContent.length > 0 && postContent.length < 20 && `(minimum 20)`}
                </div>

                {/* Image previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((img) => (
                      <div key={img.publicId} className="relative group">
                        <img
                          src={img.url}
                          alt="Upload preview"
                          className={`w-full h-32 rounded-lg object-cover ${blurRequested ? 'blur-md' : ''}`}
                        />
                        <button
                          onClick={() => removeLocalImage(img.publicId)}
                          disabled={posting}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors opacity-90 group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload progress */}
                {uploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uploading image...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Cloudinary warning - only shown if not configured */}
                {!HAS_CLOUDINARY && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Cloudinary configuration is missing. Image uploads won't work until you set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UNSIGNED_PRESET in your .env file.</span>
                  </div>
                )}

                {/* Error message */}
                {postError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{postError}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onFilesChange}
                    disabled={uploading || posting || !HAS_CLOUDINARY || images.length >= MAX_IMAGES}
                    className="hidden"
                  />
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || posting || !HAS_CLOUDINARY || images.length >= MAX_IMAGES}
                    className="flex items-center gap-2 h-8 px-3 rounded-2xl border border-grey-90 bg-transparent shadow-sm hover:bg-grey-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="font-geist text-sm text-[#0A0A0A]">
                      {images.length > 0 ? `Add Images (${images.length}/${MAX_IMAGES})` : "Add Images"}
                    </span>
                  </button>
                </div>
                
                <button 
                  onClick={handlePostSubmit}
                  disabled={posting || uploading || postContent.trim().length < 20}
                  className="self-end flex items-center gap-2 h-9 px-3 rounded-2xl bg-gradient-to-r from-[#88D2EE] to-[#1FB1C4] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {posting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 17" fill="none">
                      <path
                        d="M9.69021 14.8323L14.6482 2.14966L1.55821 6.05966L6.82888 8.80433L9.69021 14.8323Z"
                        stroke="white"
                        strokeWidth="1.33333"
                      />
                      <path
                        d="M14.5697 1.80634L7.27637 9.099"
                        stroke="white"
                        strokeWidth="1.33333"
                      />
                    </svg>
                  )}
                  <span className="font-geist font-semibold text-sm text-white">
                    {posting ? "Posting..." : "Post"}
                  </span>
                </button>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-cyan-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Error state */}
            {feedError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-center">
                {feedError}
              </div>
            )}

            {/* Posts */}
            {!loading && posts.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
                <p className="text-azure-27 font-geist">No posts yet. Be the first to share!</p>
              </div>
            )}

            {!loading && posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] flex flex-col gap-4"
              >
                {/* Post Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#89D3EE] to-[#1BB0C3] text-white font-geist font-semibold">
                        {post.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-geist font-semibold text-base text-azure-11">
                          {post.nickname}
                        </span>
                        <span className="font-geist text-xs text-azure-46">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      disabled={deletingPost === post._id}
                      className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete post"
                    >
                      {deletingPost === post._id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {post.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.topics.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-[rgba(133,222,242,0.2)] text-cyan-primary font-geist text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <p className="font-geist text-base text-azure-27 leading-6 whitespace-pre-wrap">
                  {post.text}
                </p>

                {/* Post Images */}
                {post.images && post.images.length > 0 ? (
                  <div className={`grid gap-3 max-w-[816px] ${
                    post.images.length === 1 ? 'grid-cols-1' : 
                    post.images.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2'
                  }`}>
                    {post.images.map((img, idx) => (
                      <div key={img.publicId || idx} className="rounded-[20px] overflow-hidden">
                        <img
                          src={img.url}
                          alt={`Post image ${idx + 1}`}
                          className={`w-full ${post.images!.length === 1 ? 'max-h-[500px]' : 'max-h-[300px]'} object-cover ${post.blurRequested ? 'blur-md' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : post.imageUrl ? (
                  // Legacy single image support
                  <div className="rounded-[20px] overflow-hidden max-w-[816px]">
                    <img
                      src={post.imageUrl}
                      alt="Post image"
                      className={`w-full max-h-[500px] object-cover ${post.blurRequested ? 'blur-md' : ''}`}
                    />
                  </div>
                ) : null}

                {/* Post Footer */}
                <div className="flex items-center gap-4 pt-4 border-t border-grey-96">
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-2 h-8 px-2.5 rounded-[14px] hover:bg-grey-96 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-azure-34" />
                    <span className="font-geist text-sm text-azure-34">
                      {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
                    </span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPost === post._id && (
                  <div className="border-t border-grey-96 pt-4 space-y-4">
                    {/* Comment Form */}
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={commentNickname}
                          onChange={(e) => !isPeerAdvocate && setCommentNickname(e.target.value)}
                          placeholder="Your nickname (optional)"
                          className={`h-8 px-3 rounded-2xl border shadow-sm font-geist text-sm placeholder:text-grey-45 ${
                            isPeerAdvocate 
                              ? 'bg-teal-50 border-teal-300 text-teal-700 font-medium cursor-not-allowed' 
                              : 'border-grey-90 bg-transparent'
                          }`}
                          disabled={postingComment || isPeerAdvocate}
                          readOnly={isPeerAdvocate}
                        />
                        {isPeerAdvocate && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                            PEER ADVOCATE ★
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment... (5-500 characters)"
                          className="flex-1 h-8 px-3 rounded-2xl border border-grey-90 bg-transparent shadow-sm font-geist text-sm placeholder:text-grey-45"
                          disabled={postingComment}
                          minLength={5}
                          maxLength={500}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (commentText.trim().length >= 5) {
                                handleCommentSubmit(post._id);
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => handleCommentSubmit(post._id)}
                          disabled={postingComment || commentText.trim().length < 5}
                          className="h-8 px-4 rounded-2xl bg-gradient-to-r from-[#88D2EE] to-[#1FB1C4] shadow-sm font-geist text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {postingComment ? '...' : 'Send'}
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {loadingComments[post._id] ? (
                        <div className="text-center py-4">
                          <div className="w-6 h-6 border-2 border-cyan-primary border-t-transparent rounded-full animate-spin inline-block" />
                        </div>
                      ) : (
                        comments[post._id]?.map((comment) => (
                          <div key={comment._id} className="flex gap-2 p-3 bg-grey-95 rounded-xl">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-b from-[#89D3EE] to-[#1BB0C3] text-white font-geist text-xs font-semibold flex-shrink-0">
                              {comment.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="font-geist font-semibold text-sm text-azure-11">
                                  {comment.nickname}
                                </span>
                                {comment.isPeerAdvocate && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-medium whitespace-nowrap">
                                    PEER ADVOCATE ★
                                  </span>
                                )}
                                <span className="font-geist text-xs text-azure-46">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="font-geist text-sm text-azure-27 mt-1">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {!loadingComments[post._id] && comments[post._id]?.length === 0 && (
                        <p className="text-center text-grey-45 text-sm py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="h-9 px-4 rounded-2xl border border-grey-90 bg-white shadow-sm font-geist text-sm hover:bg-grey-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="font-geist text-sm text-azure-27">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="h-9 px-4 rounded-2xl border border-grey-90 bg-white shadow-sm font-geist text-sm hover:bg-grey-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

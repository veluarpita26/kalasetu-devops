import API from "./axios";

// ✅ POSTS
export const getPosts = () => API.get("/posts");

export const getPostById = (id) => API.get(`/posts/${id}`);

export const createPost = (data) => API.post("/posts", data);

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const likePost = (id) => API.put(`/posts/${id}/like`);


// ✅ COMMENTS (FIXED + COMPLETE)
export const getComments = (postId) =>
  API.get(`/posts/${postId}/comments`);

export const addComment = (postId, content) =>
  API.post(`/posts/${postId}/comments`, { content });

export const deleteComment = (postId, commentId) =>
  API.delete(`/posts/${postId}/comments/${commentId}`);
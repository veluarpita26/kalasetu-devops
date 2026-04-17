import React, { useEffect, useState } from "react";
import * as postAPI from "../api/communityApi";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");

  // ✅ FETCH POSTS
  const fetchPosts = async () => {
    try {
      const res = await postAPI.getPosts();

      console.log("POST RESPONSE:", res.data);

      const data = res?.data?.data || {};
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ CREATE POST
  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return alert("Fill all fields");

    try {
      await postAPI.createPost(newPost);

      setNewPost({ title: "", content: "" });

      fetchPosts(); // refresh
    } catch (err) {
      console.error(err);
      alert("Login required to post");
    }
  };

  // ✅ LIKE POST
  const handleLike = async (postId) => {
    try {
      await postAPI.likePost(postId);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH COMMENTS
  const fetchComments = async (postId) => {
    try {
      const res = await postAPI.getComments(postId);

      const data = res?.data?.data || [];
      setComments((prev) => ({
        ...prev,
        [postId]: data,
      }));
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  // ✅ ADD COMMENT
  const handleAddComment = async (postId) => {
    if (!commentText) return;

    try {
      await postAPI.addComment(postId, commentText);

      setCommentText("");

      fetchComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>🤝 Artisan Community</h1>

      {/* ✅ CREATE POST */}
      <div style={{ marginBottom: 30 }}>
        <input
          placeholder="Title"
          value={newPost.title}
          onChange={(e) =>
            setNewPost({ ...newPost, title: e.target.value })
          }
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <textarea
          placeholder="Write something..."
          value={newPost.content}
          onChange={(e) =>
            setNewPost({ ...newPost, content: e.target.value })
          }
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button onClick={handleCreatePost}>Post</button>
      </div>

      {/* ✅ POSTS */}
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to share!</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              background: "#fff",
              padding: 16,
              marginBottom: 16,
              borderRadius: 10,
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <small>
              by {post.author?.name} • ❤️ {post.likesCount}
            </small>

            {/* ✅ LIKE */}
            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleLike(post._id)}>
                ❤️ Like
              </button>
            </div>

            {/* ✅ COMMENTS */}
            <div style={{ marginTop: 10 }}>
              <button onClick={() => fetchComments(post._id)}>
                Show Comments
              </button>

              <div style={{ marginTop: 10 }}>
                {(comments[post._id] || []).map((c, i) => (
                  <p key={i}>
                    <b>{c.user?.name}:</b> {c.content}
                  </p>
                ))}
              </div>

              {/* ADD COMMENT */}
              <input
                placeholder="Write comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <button onClick={() => handleAddComment(post._id)}>
                Add
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Community;
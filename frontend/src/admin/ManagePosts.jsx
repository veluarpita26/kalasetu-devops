import React, { useEffect, useState } from "react";
// ✅ Correct - one level up from src/admin/ reaches src/api/
import { adminGetAllPosts, adminDeletePost } from "../api/adminApi";
import Loader from "../components/Loader";

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await adminGetAllPosts();
      setPosts(res.data?.posts || res.data || []);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await adminDeletePost(id);
    fetchPosts();
  };

  if (loading) return <Loader message="Loading posts..." />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 5vw" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1f1f2e", marginBottom: 24 }}>📝 Manage Community Posts</h1>
      {posts.length === 0 ? (
        <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>No posts found.</p>
      ) : posts.map(post => (
        <div key={post._id} style={{
          background: "#fff", border: "1px solid #ede9fe", borderRadius: 14,
          padding: "16px 20px", marginBottom: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f1f2e", margin: "0 0 4px" }}>{post.title}</h3>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 8px" }}>
                By {post.author?.name || "Unknown"} · {new Date(post.createdAt).toLocaleDateString("en-IN")}
              </p>
              <p style={{ fontSize: 14, color: "#4b5563", margin: 0, lineHeight: 1.6 }}>
                {post.content?.slice(0, 200)}{post.content?.length > 200 ? "..." : ""}
              </p>
            </div>
            <button onClick={() => handleDelete(post._id)}
              style={{ marginLeft: 16, background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 7, padding: "6px 16px", cursor: "pointer", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManagePosts;
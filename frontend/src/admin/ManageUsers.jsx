import React, { useEffect, useState } from "react";
import * as adminAPI from "../api/adminApi";
import Loader from "../components/Loader";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data?.users || res.data || []);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await adminAPI.deleteUser(id);
    fetchUsers();
  };

  const roleColor = { admin: "#7c3aed", artisan: "#d97706", user: "#16a34a" };

  if (loading) return <Loader message="Loading users..." />;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 5vw" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1f1f2e", marginBottom: 24 }}>👥 Manage Users</h1>
      <div style={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf5ff" }}>
              {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: "#3b0764", borderBottom: "1px solid #ede9fe" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{u.name}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{u.email}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{
                    fontSize: 12, background: `${roleColor[u.role]}20`, color: roleColor[u.role],
                    borderRadius: 999, padding: "2px 10px", fontWeight: 600, textTransform: "capitalize",
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#9ca3af" }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => handleDelete(u._id)}
                    style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>No users found.</p>}
      </div>
    </div>
  );
};

export default ManageUsers;
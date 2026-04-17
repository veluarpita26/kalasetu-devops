import React, { useEffect, useState } from "react";
import { getMyProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
import Loader from "../components/Loader";

// ✅ YOUR CLOUDINARY DETAILS
const CLOUDINARY_CLOUD_NAME = "djdifsst6";
const CLOUDINARY_UPLOAD_PRESET = "kalasetu_upload";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "Pottery",
  stock: "",
  images: [],
};

const CATEGORIES = ["Pottery", "Weaving", "Woodcarving", "Painting", "Jewellery", "Textile", "Other"];

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [previewImages, setPreviewImages] = useState([]);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await getMyProducts();
      setProducts(res.data?.data || res.data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= CLOUDINARY UPLOAD =================
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const json = await res.json();
    return json.secure_url;
  };

  // ================= HANDLE IMAGE =================
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      // preview
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...previews]);

      // upload
      const uploadedUrls = await Promise.all(files.map(uploadToCloudinary));

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      alert("❌ Image upload failed");
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      alert("Please wait for image upload");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editing) {
        await updateProduct(editing, payload);
      } else {
        await createProduct(payload);
      }

      // reset
      setForm(EMPTY_FORM);
      setPreviewImages([]);
      setEditing(null);
      setShowForm(false);

      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (p) => {
    setForm({
      ...p,
      price: String(p.price),
      stock: String(p.stock),
    });

    setPreviewImages(p.images || []);
    setEditing(p._id);
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await deleteProduct(id);
    fetchProducts();
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setPreviewImages([]);
    setEditing(null);
    setShowForm(false);
  };

  if (loading) return <Loader message="Loading products..." />;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2>🛍️ Manage Products</h2>

        <button onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            required
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            required
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* IMAGE */}
          <input type="file" multiple onChange={handleImageChange} />

          {/* PREVIEW */}
          <div style={{ display: "flex", gap: 10 }}>
            {previewImages.map((img, i) => (
              <div key={i}>
                <img src={img} width={80} />
                <button type="button" onClick={() => removeImage(i)}>
                  X
                </button>
              </div>
            ))}
          </div>

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Save Product"}
          </button>
        </form>
      )}

      {/* PRODUCTS */}
      {products.length === 0 ? (
        <p>No products yet</p>
      ) : (
        products.map((p) => (
          <div key={p._id} style={{ marginTop: 20 }}>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            {p.images?.[0] && (
              <img src={p.images[0]} width={120} alt="" />
            )}

            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageProducts;
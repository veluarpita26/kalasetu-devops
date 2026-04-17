import React from "react";

const categories = ["All", "Pottery", "Weaving", "Woodcarving", "Painting", "Jewellery", "Textile", "Other"];

const FilterBar = ({ filters, onChange }) => {
  const inputStyle = {
    padding: "8px 14px", borderRadius: 8, border: "1.5px solid #ddd6fe",
    fontSize: 14, color: "#3b0764", outline: "none", background: "#faf5ff",
  };

  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
      background: "#fff", padding: "14px 20px", borderRadius: 14,
      boxShadow: "0 2px 8px rgba(124,58,237,0.07)", marginBottom: 28,
      border: "1px solid #ede9fe",
    }}>
      <input
        type="text" placeholder="🔍 Search products..."
        value={filters.search || ""}
        onChange={e => onChange({ ...filters, search: e.target.value })}
        style={{ ...inputStyle, minWidth: 200, flex: 1 }}
      />
      <select
        value={filters.category || "All"}
        onChange={e => onChange({ ...filters, category: e.target.value })}
        style={inputStyle}
      >
        {categories.map(c => <option key={c}>{c}</option>)}
      </select>
      <select
        value={filters.sort || "newest"}
        onChange={e => onChange({ ...filters, sort: e.target.value })}
        style={inputStyle}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
      <button
        onClick={() => onChange({ search: "", category: "All", sort: "newest" })}
        style={{
          padding: "8px 16px", borderRadius: 8, border: "1.5px solid #ddd6fe",
          background: "#fff", color: "#7c3aed", fontWeight: 600, cursor: "pointer", fontSize: 13,
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default FilterBar;
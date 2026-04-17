import React, { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "newest",
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };

      if (filters.search) params.search = filters.search;
      if (filters.category !== "All") params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;

      const res = await getAllProducts(params);

      console.log("API RESPONSE:", res.data);

      // ✅ Correct extraction
      const data = res?.data?.data || {};

      const productsArray = Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(productsArray);
      setTotal(data.total || productsArray.length);

      // ✅ Debug
      if (productsArray.length > 0) {
        console.log("FIRST PRODUCT:", productsArray[0]);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (f) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 5vw" }}>
      
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1f1f2e", marginBottom: 24 }}>
        🛍️ Explore Handcrafted Products
      </h1>

      <FilterBar filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <Loader message="Fetching products..." />
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 18, fontWeight: 600 }}>No products found</p>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
            {total || products.length} products found
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))",
              gap: 20,
            }}
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {total > limit && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 32,
              }}
            >
              {Array.from(
                { length: Math.ceil(total / limit) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1.5px solid #ddd6fe",
                      background: page === i + 1 ? "#7c3aed" : "#fff",
                      color: page === i + 1 ? "#fff" : "#7c3aed",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
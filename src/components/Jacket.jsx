import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Star, StarHalf } from "lucide-react";
import {
  useNavigate,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function Jacket() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [jacketType, setJacketType] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  const handlePriceChange = (range) => setPriceRange(range);
  const handleTypeChange = (type) => setJacketType(type);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/jacket");
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique brands from products
  const uniqueBrands = [...new Set(products.map((product) => product.brand))];
  // Get unique jacket types from products
  const uniqueTypes = [...new Set(products.map((product) => product.type))];

  const filteredProducts = products.filter((product) => {
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice =
      priceRange === null ||
      (priceRange === "500-1000" &&
        product.discountedPrice >= 500 &&
        product.discountedPrice <= 1000) ||
      (priceRange === "1000-1500" &&
        product.discountedPrice > 1000 &&
        product.discountedPrice <= 1500) ||
      (priceRange === "1500-2000" &&
        product.discountedPrice > 1500 &&
        product.discountedPrice <= 2000) ||
      (priceRange === "2000above" && product.discountedPrice > 2000);
    const matchesType = jacketType === null || product.type === jacketType;
    return matchesBrand && matchesPrice && matchesType;
  });

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<Star key={i} className="text-warning" size={16} />);
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        stars.push(<StarHalf key={i} className="text-warning" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-muted" size={16} />);
      }
    }
    return stars;
  };

  const FilterSection = ({ title, children }) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-header bg-light">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light py-4">
        <div className="container">
          <h1 className="mb-4 text-primary">Men's Jackets</h1>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <div className="row g-4">
              {/* Filters Column */}
              <div className="col-lg-3">
                <div className="sticky-top" style={{ top: "20px" }}>
                  <FilterSection title="Brand">
                    {uniqueBrands.map((brand) => (
                      <div className="form-check" key={brand}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          id={`brand-${brand}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`brand-${brand}`}
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </FilterSection>

                  <FilterSection title="Price Range">
                    {[
                      { label: "₹500 - ₹1,000", value: "500-1000" },
                      { label: "₹1,000 - ₹1,500", value: "1000-1500" },
                      { label: "₹1,500 - ₹2,000", value: "1500-2000" },
                      { label: "Above ₹2,000", value: "2000above" },
                    ].map((range) => (
                      <div className="form-check" key={range.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="price"
                          checked={priceRange === range.value}
                          onChange={() => handlePriceChange(range.value)}
                          id={`price-${range.value}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`price-${range.value}`}
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </FilterSection>

                  <FilterSection title="Jacket Type">
                    {uniqueTypes.map((type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="jacketType"
                          checked={jacketType === type}
                          onChange={() => handleTypeChange(type)}
                          id={`type-${type}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`type-${type}`}
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </FilterSection>

                  {/* Clear Filters Button */}
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setSelectedBrands([]);
                          setPriceRange(null);
                          setJacketType(null);
                        }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="col-lg-9">
                <div className="row g-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm hover-shadow transition-all">
                          <div className="position-relative">
                            <img
                              src={product.image}
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "contain" }}
                              alt={product.name}
                            />
                            <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                              {product.discount}% OFF
                            </span>
                          </div>
                          <div className="card-body">
                            <h5 className="card-title mb-1">{product.name}</h5>
                            <p className="text-muted small mb-2">
                              {product.brand}
                            </p>
                            <div className="mb-2">
                              {renderRatingStars(product.rating)}
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span className="text-decoration-line-through text-muted">
                                ₹{product.originalPrice}
                              </span>
                              <span className="fs-5 fw-bold text-primary">
                                ₹{product.discountedPrice}
                              </span>
                            </div>
                            <div className="small text-muted">
                              <div>{product.type}</div>
                            </div>
                          </div>
                          <div className="card-footer bg-white border-top-0">
                            <Link
                              to={`/jacket/${product.id}`}
                              state={product}
                              className="btn btn-primary w-100"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <div className="alert alert-info text-center">
                        No products found matching your criteria.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Jacket;

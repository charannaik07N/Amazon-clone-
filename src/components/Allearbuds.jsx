import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";

// Product Details Component
const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = parseInt(id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/Earbuds/${productId}`
        );
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  if (error)
    return <div className="container py-5 alert alert-danger">{error}</div>;
  if (!product)
    return (
      <div className="container py-5 alert alert-warning">
        Product not found
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <button
          className="btn btn-outline-primary mb-4"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Products
        </button>

        <div className="card border-0 shadow-sm">
          <div className="row g-0">
            <div className="col-md-5 bg-light d-flex align-items-center justify-content-center p-4">
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
            <div className="col-md-7">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-dark">{product.brand}</span>
                  <span className="badge bg-danger">-{product.discount}%</span>
                </div>
                <h2 className="card-title mb-3">{product.name}</h2>
                <div className="mb-3">
                  {Array(product.rating)
                    .fill()
                    .map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning"></i>
                    ))}
                  {Array(5 - product.rating)
                    .fill()
                    .map((_, i) => (
                      <i key={i} className="bi bi-star text-warning"></i>
                    ))}
                  <small className="text-muted ms-2">
                    ({Math.floor(Math.random() * 100) + 50} reviews)
                  </small>
                </div>

                <div className="d-flex align-items-baseline mb-4">
                  <span className="text-decoration-line-through text-muted me-2">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="fs-3 fw-bold text-primary">
                    ₹{product.discountedPrice.toLocaleString()}
                  </span>
                </div>

                <h5 className="mb-3">Key Features</h5>
                <ul className="list-group list-group-flush mb-4">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="list-group-item bg-transparent ps-0"
                    >
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                  <button
                    className="btn btn-primary btn-lg px-4"
                    onClick={() => {
                      // Create product object for cart
                      const cartItem = {
                        productId: `earbuds_${product.id}`,
                        name: product.name,
                        price: product.discountedPrice,
                        quantity: 1,
                        image: product.image,
                        category: "Earbuds",
                        brand: product.brand,
                        discount: product.discount,
                      };

                      // Dispatch custom event for cart update
                      const event = new CustomEvent("cartUpdate", {
                        detail: { product: cartItem, action: "add" },
                      });
                      window.dispatchEvent(event);

                      // Show success message
                      alert(`Added ${product.name} to cart!`);
                    }}
                  >
                    <i className="bi bi-cart-plus me-2"></i> Add to Cart
                  </button>
                  <button className="btn btn-outline-secondary btn-lg px-4">
                    <i className="bi bi-heart me-2"></i> Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

function AllEarbuds() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [rating, setRating] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/Earbuds");
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

  // Reset filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setRating(null);
    setDiscount(null);
    setSelectedFeatures([]);
  };

  // Filter products based on selected criteria
  const filteredProducts = products.filter((product) => {
    // Brand filter
    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    // Price range filter
    const priceMatch =
      !priceRange ||
      (priceRange === "0-5000" && product.discountedPrice <= 5000) ||
      (priceRange === "5000-10000" &&
        product.discountedPrice > 5000 &&
        product.discountedPrice <= 10000) ||
      (priceRange === "10000-20000" &&
        product.discountedPrice > 10000 &&
        product.discountedPrice <= 20000) ||
      (priceRange === "above-20000" && product.discountedPrice > 20000);

    // Rating filter
    const ratingMatch = !rating || product.rating >= rating;

    // Discount filter
    const discountMatch = !discount || product.discount >= discount;

    // Features filter
    const featuresMatch =
      selectedFeatures.length === 0 ||
      selectedFeatures.every(
        (feature) => product.features && product.features.includes(feature)
      );

    return (
      brandMatch && priceMatch && ratingMatch && discountMatch && featuresMatch
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts];
  switch (sortOption) {
    case "price-low-high":
      sortedProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
      break;
    case "price-high-low":
      sortedProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
      break;
    case "discount":
      sortedProducts.sort((a, b) => b.discount - a.discount);
      break;
    case "rating":
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // default/featured - keep original order
      break;
  }

  // Handler functions
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (range) => {
    setPriceRange(range === priceRange ? null : range);
  };

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating === rating ? null : selectedRating);
  };

  const handleDiscountChange = (selectedDiscount) => {
    setDiscount(selectedDiscount === discount ? null : selectedDiscount);
  };

  const handleFeatureChange = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // View product details - Updated to navigate to detailed view
  const viewProductDetails = (productId) => {
    navigate(`/earbuds-details/${productId}`);
  };

  // Navigate to add product page
  const navigateToAddProduct = () => {
    navigate("/add-product");
  };

  // Count active filters
  const activeFiltersCount =
    selectedBrands.length +
    (priceRange ? 1 : 0) +
    (rating ? 1 : 0) +
    (discount ? 1 : 0) +
    selectedFeatures.length;

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Try Again
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient text-Black py-5 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">Premium Earbuds Collection</h1>
              <p className="lead">
                Discover the perfect sound experience with our top-rated
                wireless earbuds collection.
              </p>
              <p className="mb-0">
                <span className="badge bg-warning text-dark me-2">
                  Free Shipping
                </span>
                <span className="badge bg-danger me-2">
                  10% Off First Order
                </span>
                <span className="badge bg-success">1 Year Warranty</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Admin Controls */}
        {/* <div className="mb-4">
          <button className="btn btn-success" onClick={navigateToAddProduct}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Product
          </button>
        </div> */}

        {/* Filters and sorting toolbar */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <button
              className="btn btn-outline-primary me-2 d-lg-none"
              onClick={toggleFilters}
              aria-expanded={showFilters}
            >
              <i className="bi bi-funnel me-1"></i>
              Filters
              {activeFiltersCount > 0 && (
                <span className="badge bg-primary ms-1">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="d-flex align-items-center">
              <span className="text-muted me-2">Sort by:</span>
              <select
                className="form-select form-select-sm"
                value={sortOption}
                onChange={handleSortChange}
                style={{ width: "auto" }}
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>

          <div>
            <span className="text-muted me-2">
              Showing {sortedProducts.length} of {products.length} products
            </span>
            {activeFiltersCount > 0 && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={resetFilters}
              >
                <i className="bi bi-x-circle me-1"></i> Clear All Filters
              </button>
            )}
          </div>
        </div>

        <div className="row g-4">
          {/* Filters Sidebar */}
          <div
            className={`col-lg-3 ${
              showFilters ? "d-block" : "d-none d-lg-block"
            }`}
          >
            <div
              className="card shadow-sm border-0 sticky-top"
              style={{ top: "20px", zIndex: "100" }}
            >
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Filters</h5>
                <button
                  className="btn btn-sm btn-outline-light d-lg-none"
                  onClick={toggleFilters}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <div className="card-body p-3">
                {/* Brand Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2 mb-3">
                    <i className="bi bi-tag me-2"></i>Brand
                  </h6>
                  {/* Get unique brands from products */}
                  {Array.from(new Set(products.map((p) => p.brand))).map(
                    (brand) => (
                      <div className="form-check mb-2" key={brand}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                        />
                        <label
                          className="form-check-label d-flex justify-content-between"
                          htmlFor={`brand-${brand}`}
                        >
                          {brand}
                          <span className="badge bg-light text-dark">
                            {products.filter((p) => p.brand === brand).length}
                          </span>
                        </label>
                      </div>
                    )
                  )}
                </div>

                {/* Price Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2 mb-3">
                    <i className="bi bi-currency-rupee me-2"></i>Price Range
                  </h6>
                  {[
                    { value: "0-5000", label: "₹0 - ₹5,000" },
                    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
                    { value: "10000-20000", label: "₹10,000 - ₹20,000" },
                    { value: "above-20000", label: "Above ₹20,000" },
                  ].map((range) => (
                    <div className="form-check mb-2" key={range.value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="price"
                        id={`price-${range.value}`}
                        checked={priceRange === range.value}
                        onChange={() => handlePriceChange(range.value)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`price-${range.value}`}
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Rating Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2 mb-3">
                    <i className="bi bi-star-fill me-2"></i>Rating
                  </h6>
                  {[5, 4, 3].map((rate) => (
                    <div className="form-check mb-2" key={rate}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="rating"
                        id={`rating-${rate}`}
                        checked={rating === rate}
                        onChange={() => handleRatingChange(rate)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`rating-${rate}`}
                      >
                        {Array(rate)
                          .fill()
                          .map((_, i) => (
                            <i
                              key={i}
                              className="bi bi-star-fill text-warning me-1"
                            ></i>
                          ))}
                        <span className="ms-1">& above</span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Discount Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2 mb-3">
                    <i className="bi bi-percent me-2"></i>Discount
                  </h6>
                  {[20, 15, 10].map((disc) => (
                    <div className="form-check mb-2" key={disc}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="discount"
                        id={`discount-${disc}`}
                        checked={discount === disc}
                        onChange={() => handleDiscountChange(disc)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`discount-${disc}`}
                      >
                        {disc}% & above
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <div key={product.id} className="col">
                    <div className="card h-100 shadow-sm border-0 product-card">
                      <div className="position-relative">
                        <div
                          className="card-img-container bg-light rounded-top d-flex align-items-center justify-content-center"
                          style={{ height: "200px" }}
                        >
                          <img
                            src={product.image}
                            className="card-img-top p-3"
                            alt={product.name}
                            style={{
                              maxHeight: "180px",
                              maxWidth: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                        {product.discount >= 15 ? (
                          <div className="ribbon ribbon-top-right">
                            <span>HOT DEAL</span>
                          </div>
                        ) : (
                          <span className="position-absolute top-0 end-0 badge bg-danger m-3">
                            -{product.discount}%
                          </span>
                        )}
                        <div className="position-absolute bottom-0 start-0 m-3">
                          <span className="badge bg-dark">{product.brand}</span>
                        </div>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2">
                          {Array(product.rating)
                            .fill()
                            .map((_, i) => (
                              <i
                                key={i}
                                className="bi bi-star-fill text-warning"
                              ></i>
                            ))}
                          {Array(5 - product.rating)
                            .fill()
                            .map((_, i) => (
                              <i
                                key={i}
                                className="bi bi-star text-warning"
                              ></i>
                            ))}
                          <small className="text-muted ms-2">
                            ({Math.floor(Math.random() * 100) + 50} reviews)
                          </small>
                        </div>
                        <h5 className="card-title">{product.name}</h5>
                        <div className="d-flex align-items-baseline mb-3">
                          <span className="text-decoration-line-through text-muted me-2">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                          <span className="fs-4 fw-bold text-primary">
                            ₹{product.discountedPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-auto">
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {product.features &&
                              product.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="badge bg-light text-dark border"
                                >
                                  {feature}
                                </span>
                              ))}
                          </div>
                          <div className="d-grid gap-2">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                // Create product object for cart
                                const cartItem = {
                                  productId: `earbuds_${product.id}`,
                                  name: product.name,
                                  price: product.discountedPrice,
                                  quantity: 1,
                                  image: product.image || product.images?.[0],
                                  category: "Earbuds",
                                  brand: product.brand,
                                  discount: product.discount,
                                };

                                // Dispatch custom event for cart update
                                const event = new CustomEvent("cartUpdate", {
                                  detail: { product: cartItem, action: "add" },
                                });
                                window.dispatchEvent(event);

                                // Show success message
                                alert(`Added ${product.name} to cart!`);
                              }}
                            >
                              <i className="bi bi-cart-plus me-2"></i> Add to
                              Cart
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => viewProductDetails(product.id)}
                            >
                              <i className="bi bi-eye me-2"></i> View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="alert alert-info">
                    <i className="bi bi-emoji-frown fs-1 d-block mb-3"></i>
                    <h4>No products match your selected filters</h4>
                    <p className="mb-0">
                      Try adjusting your filter criteria or{" "}
                      <button
                        className="btn btn-link p-0"
                        onClick={resetFilters}
                      >
                        reset all filters
                      </button>
                      .
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        /* General Styles */
        .bg-gradient {
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
        }
        
        .product-card {
          transition: all 0.3s ease;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
        
        .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
        
        .badge {
          transition: all 0.2s ease;
        }
        
        .badge:hover {
          transform: scale(1.05);
        }
        
        /* Ribbon style for hot deals */
        .ribbon {
          width: 150px;
          height: 150px;
          overflow: hidden;
          position: absolute;
        }
        
        .ribbon-top-right {
          top: -10px;
          right: -10px;
        }
        
        .ribbon-top-right::before,
        .ribbon-top-right::after {
          border-top-color: transparent;
          border-right-color: transparent;
        }
        
        .ribbon-top-right::before {
          top: 0;
          left: 0;
        }
        
        .ribbon-top-right::after {
          bottom: 0;
          right: 0;
        }
        
        .ribbon-top-right span {
          position: absolute;
          top: 30px;
          right: -25px;
          transform: rotate(45deg);
          width: 200px;
          background-color: #dc3545;
          color: white;
          text-align: center;
          font-size: 12px;
          font-weight: bold;
          padding: 5px 0;
          box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
        }
        
        /* Animation for cards */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .card {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        /* Improved hover effects */
        .btn-primary {
          transition: all 0.3s;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
        }
        
        .btn-outline-secondary:hover {
          transform: translateY(-2px);
        }
        
        /* Card image container */
        .card-img-container {
          transition: all 0.3s;
        }
        
        .product-card:hover .card-img-container {
          background-color: rgba(13, 110, 253, 0.05) !important;
        }
      `}</style>
    </>
  );
}

export default AllEarbuds;

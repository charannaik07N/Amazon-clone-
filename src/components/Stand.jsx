import React, { useState, useEffect } from "react";
import {
  Star,
  StarHalf,
  Table,
  Filter,
  Search,
  Loader,
  ShoppingCart,
  Tag,
  Package,
  CheckCircle,
  Eye,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function Stand() {
  // Move useNavigate to the top with other hooks
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [material, setMaterial] = useState(null);
  
  // Add state for cart operations
  const [addingToCart, setAddingToCart] = useState(null); // Store product ID being added
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  // Fetch data from API
  useEffect(() => {
    const fetchTableStands = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/tablestands");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Debug log
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching table stands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTableStands();
  }, []);

  // Get unique values for filters
  const uniqueCompanies = [
    ...new Set(products.map((p) => p.company || p.brand)),
  ];
  const uniqueMaterials = [...new Set(products.map((p) => p.material))];

  const handleCompanyChange = (company) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

  // Updated handleViewDetails function to match the route structure
  const handleViewDetails = (product) => {
    const brand = product.company || product.brand || "unknown";
    const productId = product.id;
    console.log("Viewing details for product:", productId, "Brand:", brand);
    navigate(`/table/${encodeURIComponent(brand)}/${productId}`);
  };
  
  // Add to cart functionality
  const handleAddToCart = async (product) => {
    if (addingToCart) return; // Prevent multiple simultaneous adds
    
    try {
      setAddingToCart(product.id);
      
      // Get price (use discounted price if available, otherwise original price)
      const price = product.discountedPrice || product.originalPrice || 0;
      
      // Prepare cart item data
      const cartItem = {
        productId: `stand_${product.id}`,
        name: product.name || "Table Stand",
        price: price,
        quantity: 1,
        image: product.image || "/api/placeholder/300/200",
        color: product.color || '',
        size: product.size || '',
        category: 'Table Stands',
        brand: product.company || product.brand || '',
      };

      // Send POST request to add item to cart
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      const data = await response.json();
      
      // Show success message
      setCartMessage({
        show: true,
        text: `Added ${cartItem.name} to your cart!`,
        type: 'success'
      });

      // Dispatch cart update event for other components
      window.dispatchEvent(new CustomEvent('cartUpdate', {
        detail: { product: cartItem, action: 'add' }
      }));

      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setCartMessage(prev => ({ ...prev, show: false }));
      }, 5000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage({
        show: true,
        text: error.message || 'Failed to add item to cart. Please try again.',
        type: 'danger'
      });
    } finally {
      setAddingToCart(null);
    }
  };

  // Get price for filtering (use discounted price if available, otherwise original price)
  const getProductPrice = (product) => {
    return product.discountedPrice || product.originalPrice || 0;
  };

  // Get savings amount
  const getSavings = (originalPrice, discountedPrice) => {
    if (
      !originalPrice ||
      !discountedPrice ||
      originalPrice <= discountedPrice
    ) {
      return 0;
    }
    return originalPrice - discountedPrice;
  };

  const filteredProducts = products.filter((product) => {
    const productCompany = product.company || product.brand;

    // Company filter
    const matchesCompany =
      selectedCompanies.length === 0 ||
      selectedCompanies.includes(productCompany);

    // Price filter - using discounted price for filtering
    const productPrice = getProductPrice(product);
    const matchesPrice =
      !priceRange ||
      (priceRange === "0-2000" && productPrice <= 2000) ||
      (priceRange === "2001-5000" &&
        productPrice > 2000 &&
        productPrice <= 5000) ||
      (priceRange === "5001-10000" &&
        productPrice > 5000 &&
        productPrice <= 10000) ||
      (priceRange === "10000above" && productPrice > 10000);

    // Material filter
    const matchesMaterial = !material || product.material === material;

    return matchesCompany && matchesPrice && matchesMaterial;
  });

  const FilterSection = ({ title, children, icon: Icon }) => (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-primary text-white border-0 py-3">
        <h6 className="mb-0 fw-semibold d-flex align-items-center">
          <Icon size={16} className="me-2" />
          {title}
        </h6>
      </div>
      <div className="card-body p-3">{children}</div>
    </div>
  );

  const clearAllFilters = () => {
    setSelectedCompanies([]);
    setPriceRange(null);
    setMaterial(null);
  };

  const renderRatingStars = (rating) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} className="text-warning" fill="currentColor" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          size={14}
          className="text-warning"
          fill="currentColor"
        />
      );
    }

    return (
      <div className="d-flex align-items-center gap-1">
        {stars}
        <span className="small text-muted ms-1">({rating})</span>
      </div>
    );
  };

  const renderFeatures = (features) => {
    if (!features || !Array.isArray(features)) return null;

    return (
      <div className="mb-3">
        <h6 className="text-muted mb-2 small">Features:</h6>
        <div className="d-flex flex-wrap gap-1">
          {features.slice(0, 3).map((feature, index) => (
            <span key={index} className="badge bg-light text-dark border small">
              <CheckCircle size={12} className="me-1" />
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="badge bg-secondary small">
              +{features.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid bg-light py-5 min-vh-100">
        <div className="container">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-4"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="text-muted fw-light">Loading Table Stands...</h4>
              <p className="text-muted">
                Please wait while we fetch the latest collection
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid bg-light py-5 min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="alert alert-danger shadow-lg border-0 rounded-4 text-center">
                <div className="display-1 text-danger mb-3">⚠️</div>
                <h4 className="fw-bold">Oops! Something went wrong</h4>
                <p className="mb-4">{error}</p>
                <button
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => window.location.reload()}
                >
                  <Loader className="me-2" size={18} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light py-4 min-vh-100">
        <div className="container">
          {/* Cart message alert */}
          {cartMessage.show && (
            <div className={`alert alert-${cartMessage.type} alert-dismissible fade show`} role="alert">
              {cartMessage.text}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setCartMessage({ ...cartMessage, show: false })}
                aria-label="Close"
              ></button>
            </div>
          )}
          
          {/* Header Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="bg-white rounded-4 shadow-lg p-5 mb-4 position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 opacity-10">
                  <Table size={120} className="text-primary" />
                </div>
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle p-3 me-4 shadow">
                        <Table className="text-white" size={40} />
                      </div>
                      <div>
                        <h1 className="mb-2 text-primary fw-bold display-5">
                          Table Stands
                        </h1>
                        <p className="text-muted mb-0 fs-5">
                          Discover premium table stands for every space and
                          style
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 text-lg-end">
                    <div className="bg-primary rounded-3 p-4 text-white text-center">
                      <h3 className="mb-1 fw-bold">
                        {filteredProducts.length}
                      </h3>
                      <small className="opacity-75">Products Available</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Filters Column */}
            <div className="col-lg-3">
              <div className="sticky-top" style={{ top: "20px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="text-dark mb-0 fw-bold">
                    <Filter className="me-2" size={20} />
                    Filters
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>

                <FilterSection title="Company" icon={Tag}>
                  {uniqueCompanies.map((company) => (
                    <div className="form-check mb-3" key={company}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedCompanies.includes(company)}
                        onChange={() => handleCompanyChange(company)}
                        id={`company-${company}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`company-${company}`}
                      >
                        {company}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Price Range" icon={Tag}>
                  {[
                    { label: "₹0 - ₹2,000", value: "0-2000" },
                    { label: "₹2,001 - ₹5,000", value: "2001-5000" },
                    { label: "₹5,001 - ₹10,000", value: "5001-10000" },
                    { label: "Above ₹10,000", value: "10000above" },
                  ].map((range) => (
                    <div className="form-check mb-3" key={range.value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="price"
                        checked={priceRange === range.value}
                        onChange={() => setPriceRange(range.value)}
                        id={`price-${range.value}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`price-${range.value}`}
                      >
                        {range.label}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Material" icon={Package}>
                  {uniqueMaterials.map((mat) => (
                    <div className="form-check mb-3" key={mat}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="material"
                        checked={material === mat}
                        onChange={() => setMaterial(mat)}
                        id={`material-${mat}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`material-${mat}`}
                      >
                        {mat}
                      </label>
                    </div>
                  ))}
                </FilterSection>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className="row g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const originalPrice = product.originalPrice || 0;
                    const discountedPrice =
                      product.discountedPrice || originalPrice;
                    const discount = product.discount || 0;
                    const savings = getSavings(originalPrice, discountedPrice);
                    const company = product.company || product.brand;

                    return (
                      <div key={product.id} className="col-md-6 col-xl-4">
                        <div className="card h-100 shadow-lg border-0 position-relative overflow-hidden rounded-4 hover-card">
                          {/* Image Section */}
                          <div className="position-relative">
                            <img
                              src={product.image || "/api/placeholder/300/200"}
                              className="card-img-top"
                              style={{
                                height: "200px",
                                objectFit: "contain",
                                backgroundColor: "#f8f9fa",
                              }}
                              alt={product.name || "Table Stand"}
                              onError={(e) => {
                                e.target.src = "/api/placeholder/300/200";
                              }}
                            />
                            {discount > 0 && (
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className="badge bg-danger px-2 py-1 rounded-pill">
                                  {discount}% OFF
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="card-body p-4">
                            <h5 className="card-title mb-2 fw-bold text-dark">
                              {product.name || "Table Stand"}
                            </h5>

                            {company && (
                              <p className="text-primary fw-semibold mb-3 d-flex align-items-center">
                                <Tag size={16} className="me-2" />
                                {company}
                              </p>
                            )}

                            {product.rating && (
                              <div className="mb-3">
                                {renderRatingStars(product.rating)}
                              </div>
                            )}

                            {/* Enhanced Price Display Section */}
                            <div className="mb-4">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="fs-4 fw-bold text-success">
                                  ₹{discountedPrice.toLocaleString("en-IN")}
                                </span>
                                {discount > 0 &&
                                  originalPrice > discountedPrice && (
                                    <span className="text-decoration-line-through text-muted fs-6">
                                      ₹{originalPrice.toLocaleString("en-IN")}
                                    </span>
                                  )}
                              </div>
                              {savings > 0 && (
                                <div className="text-success fw-medium small">
                                  You save ₹{savings.toLocaleString("en-IN")} (
                                  {discount}% off)
                                </div>
                              )}
                            </div>

                            {/* Material */}
                            {product.material && (
                              <div className="mb-3">
                                <div className="bg-light rounded-3 p-3 text-center">
                                  <Package
                                    size={16}
                                    className="text-muted mb-1"
                                  />
                                  <div className="small text-muted">
                                    Material
                                  </div>
                                  <div className="fw-medium">
                                    {product.material}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Features */}
                            {renderFeatures(product.features)}
                          </div>

                          <div className="card-footer bg-transparent border-0 p-4 pt-0">
                            <div className="d-grid gap-2">
                              <button 
                                className="btn btn-primary fw-semibold py-3 rounded-3 shadow-sm"
                                onClick={() => handleAddToCart(product)}
                                disabled={addingToCart === product.id}
                              >
                                {addingToCart === product.id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart size={18} className="me-2" />
                                    Add to Cart
                                  </>
                                )}
                              </button>
                              <button
                                className="btn btn-outline-primary fw-semibold py-2"
                                onClick={() => handleViewDetails(product)}
                              >
                                <Eye size={16} className="me-2" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div className="bg-white rounded-4 shadow-lg p-5">
                        <div className="bg-light rounded-circle p-4 d-inline-flex mb-4">
                          <Search className="text-muted" size={64} />
                        </div>
                        <h4 className="text-muted mb-3 fw-bold">
                          No table stands found
                        </h4>
                        <p className="text-muted mb-4 fs-5">
                          We couldn't find any table stands matching your
                          current filters.
                        </p>
                        <button
                          className="btn btn-primary btn-lg px-5 rounded-pill"
                          onClick={clearAllFilters}
                        >
                          <Filter className="me-2" size={18} />
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hover-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
          }
          .sticky-top {
            z-index: 1020;
          }
        `,
        }}
      />
    </>
  );
}

export default Stand;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  X,
  ArrowLeft,
  Star,
  ShoppingBag,
  Menu,
} from "lucide-react";

// Product Details Page Component
const ProductDetailsPage = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Generate placeholder image
  const getPlaceholderImage = (productName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    const hash = productName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const color = `hsl(${Math.abs(hash) % 360}, 70%, 85%)`;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "#333";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(productName.charAt(0).toUpperCase(), 200, 200);

    return canvas.toDataURL();
  };

  const handleAddToCart = () => {
    // Create product object for cart
    const cartItem = {
      productId: `product_${product.id}`,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image:
        product.image ||
        product.images?.[0] ||
        getPlaceholderImage(product.name),
      category: product.category,
    };

    // Dispatch custom event for cart update
    const event = new CustomEvent("cartUpdate", {
      detail: { product: cartItem, action: "add" },
    });
    window.dispatchEvent(event);

    // Show success message
    alert(`Added ${product.name} to cart!`);
  };

  // Mock images for demonstration - in real app, these would come from the product data
  const productImages = product.images || [
    product.image || getPlaceholderImage(product.name),
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-white shadow-sm sticky-top">
        <div className="container-fluid py-3">
          <div className="d-flex align-items-center">
            <button
              onClick={onBack}
              className="btn btn-link text-dark p-0 me-3"
              style={{ textDecoration: "none" }}
            >
              <ArrowLeft size={24} />
            </button>
            <h5 className="mb-0 fw-bold">Product Details</h5>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container-fluid py-4">
        <div className="row">
          {/* Product Images */}
          <div className="col-lg-6 mb-4">
            <div className="bg-white rounded shadow-sm p-4">
              <div className="text-center mb-3">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(product.name);
                  }}
                />
              </div>

              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="d-flex justify-content-center gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`btn p-1 ${
                        selectedImage === index ? "border-primary" : "border"
                      }`}
                      style={{ width: "60px", height: "60px" }}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-100 h-100 object-fit-cover rounded"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage(product.name);
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-6">
            <div className="bg-white rounded shadow-sm p-4">
              {/* Category Badge */}
              <span className="badge bg-secondary text-capitalize mb-2">
                {product.category}
              </span>

              {/* Product Name */}
              <h2 className="fw-bold mb-3">{product.name}</h2>

              {/* Rating */}
              <div className="d-flex align-items-center mb-3">
                <div className="d-flex me-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= 4 ? "text-warning" : "text-muted"}
                      fill={star <= 4 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-muted small">(4.0) 124 reviews</span>
              </div>

              {/* Price */}
              {product.price && (
                <div className="mb-4">
                  <h3 className="text-primary fw-bold">
                    ₹
                    {typeof product.price === "number"
                      ? product.price.toLocaleString()
                      : product.price}
                  </h3>
                  <small className="text-muted text-decoration-line-through">
                    ₹
                    {typeof product.price === "number"
                      ? (product.price * 1.2).toLocaleString()
                      : product.price}
                  </small>
                  <span className="badge bg-success ms-2">20% OFF</span>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <h6 className="fw-bold">Description</h6>
                <p className="text-muted">
                  {product.description ||
                    `High-quality ${product.name.toLowerCase()} with excellent features and premium build quality. Perfect for everyday use with outstanding performance and reliability.`}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <h6 className="fw-bold mb-2">Quantity</h6>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="mx-3 fw-bold">{quantity}</span>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex">
                <button
                  className="btn btn-primary btn-lg flex-fill"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} className="me-2" />
                  Add to Cart
                </button>
                <button className="btn btn-success btn-lg flex-fill">
                  <ShoppingBag size={20} className="me-2" />
                  Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-4 p-3 bg-light rounded">
                <div className="row text-center">
                  <div className="col-4">
                    <small className="text-muted d-block">Free Delivery</small>
                    <strong>2-3 Days</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Return Policy</small>
                    <strong>30 Days</strong>
                  </div>
                  <div className="col-4">
                    <small className="text-muted d-block">Warranty</small>
                    <strong>1 Year</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [availableEndpoints, setAvailableEndpoints] = useState([]);
  const [currentView, setCurrentView] = useState("navbar"); // "navbar" or "product"
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // API endpoints with validation
  const apiEndpoints = [
    { endpoint: "AllShoe", category: "Shoes" },
    { endpoint: "CaseDetails", category: "Cases" },
    { endpoint: "cases", category: "Cases" },
    { endpoint: "cool", category: "Cooling" },
    { endpoint: "coolAll", category: "Cooling" },
    { endpoint: "cycle", category: "Cycles" },
    { endpoint: "Earbuds", category: "Earbuds" },
    { endpoint: "Earbudsdetails", category: "Earbuds" },
    { endpoint: "Headset", category: "Headsets" },
    { endpoint: "headsetAll", category: "Headsets" },
    { endpoint: "jacket", category: "Jackets" },
    { endpoint: "jacketdetails", category: "Jackets" },
    { endpoint: "lightdetails", category: "Lights" },
    { endpoint: "lights", category: "Lights" },
    { endpoint: "MonitorDetails", category: "Monitors" },
    { endpoint: "Monitors", category: "Monitors" },
    { endpoint: "power", category: "Power Banks" },
    { endpoint: "powerbanks", category: "Power Banks" },
    { endpoint: "Shoes", category: "Shoes" },
    { endpoint: "Student", category: "Student Items" },
    { endpoint: "table", category: "Tables" },
    { endpoint: "tablestands", category: "Table Stands" },
    { endpoint: "Tshirt", category: "T-Shirts" },
    { endpoint: "TshirtAll", category: "T-Shirts" },
    { endpoint: "watch", category: "Watches" },
    { endpoint: "watchAll", category: "Watches" },
  ];

  // Check which endpoints are available on component mount
  useEffect(() => {
    const checkEndpoints = async () => {
      const working = [];

      for (const { endpoint, category } of apiEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(`http://localhost:5000/${endpoint}`, {
            signal: controller.signal,
            method: "HEAD",
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            working.push({ endpoint, category });
          }
        } catch (error) {
          console.warn(`Endpoint ${endpoint} is not available:`, error.message);
        }
      }

      setAvailableEndpoints(working);
    };

    checkEndpoints();
  }, []);

  // Listen for cart updates
  useEffect(() => {
    // Fetch initial cart count
    const fetchCartCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cart");
        if (response.ok) {
          const cartData = await response.json();
          setCartCount(cartData.length);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    // Listen for cart update events
    const handleCartUpdate = (event) => {
      if (event.detail.action === "add") {
        setCartCount((prevCount) => prevCount + 1);
      } else if (event.detail.action === "remove") {
        setCartCount((prevCount) => Math.max(0, prevCount - 1));
      } else if (event.detail.action === "update") {
        fetchCartCount();
      }
    };

    window.addEventListener("cartUpdate", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdate", handleCartUpdate);
    };
  }, []);

  // Fetch data from available APIs only
  const fetchAllProducts = async () => {
    const allProducts = [];
    const endpointsToUse =
      availableEndpoints.length > 0 ? availableEndpoints : apiEndpoints;

    for (const { endpoint, category } of endpointsToUse) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`http://localhost:5000/${endpoint}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const normalizedData = Array.isArray(data) ? data : [data];
          const productsWithCategory = normalizedData
            .filter((item) => item && typeof item === "object")
            .map((item, index) => ({
              ...item,
              category: category,
              id: item.id || item._id || `${endpoint}-${index}`,
              name:
                item.name ||
                item.title ||
                item.productName ||
                item.Name ||
                "Unnamed Product",
              price: item.price || item.cost || item.amount || item.Price,
              image: item.image || item.img || item.photo || item.Image,
              description:
                item.description || item.desc || item.Description || "",
            }));
          allProducts.push(...productsWithCategory);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.warn(`Failed to fetch from ${endpoint}:`, error.message);
        }
      }
    }

    return allProducts;
  };

  // Enhanced search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      const allProducts = await fetchAllProducts();

      if (allProducts.length === 0) {
        setSearchResults([]);
        return;
      }

      const filteredResults = allProducts.filter((product) => {
        const searchQuery = query.toLowerCase();
        const productName = (product.name || "").toLowerCase();
        const productDescription = (product.description || "").toLowerCase();
        const productCategory = (product.category || "").toLowerCase();

        return (
          productName.includes(searchQuery) ||
          productDescription.includes(searchQuery) ||
          productCategory.includes(searchQuery)
        );
      });

      const sortedResults = filteredResults.sort((a, b) => {
        const queryLower = query.toLowerCase();
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();

        if (aName === queryLower && bName !== queryLower) return -1;
        if (bName === queryLower && aName !== queryLower) return 1;
        if (aName.startsWith(queryLower) && !bName.startsWith(queryLower))
          return -1;
        if (bName.startsWith(queryLower) && !aName.startsWith(queryLower))
          return 1;

        return 0;
      });

      setSearchResults(sortedResults.slice(0, 10));
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, availableEndpoints]);

  // Handle search submission
  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Handle result click - Navigate to product details
  const handleResultClick = (product) => {
    setShowResults(false);
    setSearchTerm("");
    setSelectedProduct(product);
    setCurrentView("product");
  };

  // Handle back to navbar
  const handleBackToNavbar = () => {
    setCurrentView("navbar");
    setSelectedProduct(null);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Generate placeholder image
  const getPlaceholderImage = (productName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext("2d");

    const hash = productName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 48, 48);

    ctx.fillStyle = "#333";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(productName.charAt(0).toUpperCase(), 24, 24);

    return canvas.toDataURL();
  };

  // Render product details page
  if (currentView === "product" && selectedProduct) {
    return (
      <ProductDetailsPage
        product={selectedProduct}
        onBack={handleBackToNavbar}
      />
    );
  }

  // Render navbar
  return (
    <div className="w-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          {/* Brand/Logo */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <div
              className="me-2 d-flex align-items-center justify-content-center bg-primary text-white rounded"
              style={{
                height: "32px",
                width: "32px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              C
            </div>
            <span className="fw-bold fs-5 text-dark">Cart-with-Charan</span>
          </a>
          
          {/* Mobile icons for cart and user - always visible */}
          <div className="d-flex align-items-center ms-auto me-2 d-lg-none">
            <a
              href="/login"
              className="nav-link d-flex align-items-center text-dark me-3"
              style={{ textDecoration: "none" }}
            >
              <User size={20} />
            </a>
            <a
              href="/cart"
              className="nav-link d-flex align-items-center text-dark position-relative"
              style={{ textDecoration: "none" }}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartCount}
                </span>
              )}
            </a>
          </div>
          
          {/* Navbar Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
            aria-controls="navbarContent"
            aria-expanded={navbarOpen}
            aria-label="Toggle navigation"
          >
            <Menu size={24} />
          </button>
          
          {/* Collapsible Navbar Content */}
          <div 
            className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''}`} 
            id="navbarContent"
          >
            {/* Search Form - In the collapsible section for mobile */}
            <div
              className="my-3 my-lg-0 mx-lg-4 flex-grow-1"
              style={{ maxWidth: "500px" }}
              ref={searchRef}
            >
              <div className="position-relative">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="search"
                    className="form-control bg-light border-start-0"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm && setShowResults(true)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch({ preventDefault: () => {} });
                      }
                    }}
                    style={{
                      borderColor: showResults ? "#0d6efd" : "#dee2e6",
                      boxShadow: showResults
                        ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)"
                        : "none",
                    }}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 translate-middle-y text-muted"
                      style={{ right: "45px", zIndex: 5, padding: "0.25rem" }}
                      onClick={clearSearch}
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSearch}
                  >
                    <Search size={16} />
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                  <div
                    ref={resultsRef}
                    className="dropdown-menu show position-absolute w-100 mt-1 shadow-lg"
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      zIndex: 1050,
                    }}
                  >
                    {isLoading ? (
                      <div className="p-3 text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <div
                            className="spinner-border spinner-border-sm text-primary me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span className="text-muted">Searching...</span>
                        </div>
                      </div>
                    ) : availableEndpoints.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <div>Server not available</div>
                        <small>
                          Please make sure your backend server is running on
                          localhost:5000
                        </small>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((product, index) => (
                          <a
                            key={`${product.category}-${product.id}-${index}`}
                            className="dropdown-item py-2 px-3"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleResultClick(product);
                              setNavbarOpen(false);
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  product.image ||
                                  getPlaceholderImage(product.name)
                                }
                                alt={product.name || "Product"}
                                className="me-3 rounded"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  objectFit: "contain",
                                }}
                                onError={(e) => {
                                  e.target.src = getPlaceholderImage(
                                    product.name
                                  );
                                }}
                              />
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold text-dark text-truncate">
                                  {product.name || "Unnamed Product"}
                                </h6>
                                <small className="text-muted text-capitalize">
                                  {product.category}
                                </small>
                                {product.price && (
                                  <div className="fw-bold text-primary">
                                    ₹
                                    {typeof product.price === "number"
                                      ? product.price.toLocaleString()
                                      : product.price}
                                  </div>
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                        <div className="dropdown-divider"></div>
                        <div className="p-2 text-center">
                          <button
                            className="btn btn-link text-primary fw-medium"
                            onClick={() => {
                              setShowResults(false);
                              setNavbarOpen(false);
                              navigate(
                                `/search?query=${encodeURIComponent(searchTerm)}`
                              );
                            }}
                          >
                            View all results for "{searchTerm}"
                          </button>
                        </div>
                      </>
                    ) : searchTerm ? (
                      <div className="p-4 text-center text-muted">
                        <div>No products found for "{searchTerm}"</div>
                        <small>Try searching with different keywords</small>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Links - Only shown on desktop */}
            <div className="navbar-nav ms-auto d-none d-lg-flex">
              <a
                href="/login"
                className="nav-link d-flex align-items-center text-dark me-3"
                style={{ textDecoration: "none" }}
              >
                <User size={20} className="me-1" />
                <span>Login</span>
              </a>
              <a
                href="/cart"
                className="nav-link d-flex align-items-center text-dark position-relative"
                style={{ textDecoration: "none" }}
              >
                <ShoppingCart size={20} className="me-1" />
                <span>Cart</span>
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartCount > 0 ? cartCount : ""}
                </span>
              </a>
            </div>
            
            {/* Additional links in mobile menu */}
            <div className="d-lg-none mt-3">
              <div className="list-group">
                <a
                  href="/categories"
                  className="list-group-item list-group-item-action"
                >
                  Categories
                </a>
                <a
                  href="/deals"
                  className="list-group-item list-group-item-action"
                >
                  Deals
                </a>
                <a
                  href="/new-arrivals"
                  className="list-group-item list-group-item-action"
                >
                  New Arrivals
                </a>
                <a
                  href="/contact"
                  className="list-group-item list-group-item-action"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
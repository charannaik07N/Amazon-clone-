import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  Star,
  StarHalf,
  ShoppingCart,
  Filter,
  Search,
  ChevronDown,
  Loader,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
// Import the CSS file
import "./AllShoe.css";

function AllShoe() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [shoeType, setShoeType] = useState(null);
  const [size, setSize] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add state for cart operations
  const [addingToCart, setAddingToCart] = useState(null); // Store product ID being added
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });
  
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
  const handleShoeTypeChange = (type) => setShoeType(type);
  const handleSizeChange = (size) => setSize(size);
  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setShoeType(null);
    setSize(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/Shoes");
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
  
  // Add to cart functionality
  const handleAddToCart = async (product) => {
    if (addingToCart) return; // Prevent multiple simultaneous adds
    
    try {
      setAddingToCart(product.id);
      
      // Prepare cart item data
      const cartItem = {
        productId: `shoe_${product.id}`,
        name: product.name,
        price: product.discountedPrice,
        quantity: 1,
        image: product.image,
        color: product.color || '',
        size: product.size || '',
        category: 'Shoes',
        brand: product.brand,
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
        text: `Added ${product.name} to your cart!`,
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
    const matchesShoeType = shoeType === null || product.shoeType === shoeType;
    const matchesSize = size === null || product.size === size;
    return matchesBrand && matchesPrice && matchesShoeType && matchesSize;
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
    <div className="card mb-3 border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h6 className="mb-0 fw-bold">{title}</h6>
      </div>
      <div className="card-body py-3">{children}</div>
    </div>
  );

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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
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
      <div className="container-fluid py-4 bg-light">
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
          
          {/* Header section with title and filter toggle */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0 fw-bold text-primary">Men's Shoes</h1>
            <button
              className="btn btn-outline-primary d-md-none"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="me-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Active filters display */}
          {(selectedBrands.length > 0 || priceRange || shoeType || size) && (
            <div className="mb-4 p-3 bg-white rounded shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Active Filters:</h6>
                <button
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={resetFilters}
                >
                  Clear All
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="badge bg-primary bg-opacity-10 text-primary py-2 px-3"
                  >
                    {brand}{" "}
                    <span
                      role="button"
                      onClick={() => handleBrandChange(brand)}
                      className="ms-1"
                    >
                      ×
                    </span>
                  </span>
                ))}
                {priceRange && (
                  <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
                    {priceRange === "500-1000"
                      ? "₹500 - ₹1,000"
                      : priceRange === "1000-1500"
                      ? "₹1,000 - ₹1,500"
                      : priceRange === "1500-2000"
                      ? "₹1,500 - ₹2,000"
                      : "Above ₹2,000"}
                    <span
                      role="button"
                      onClick={() => setPriceRange(null)}
                      className="ms-1"
                    >
                      ×
                    </span>
                  </span>
                )}
                {shoeType && (
                  <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
                    {shoeType}{" "}
                    <span
                      role="button"
                      onClick={() => setShoeType(null)}
                      className="ms-1"
                    >
                      ×
                    </span>
                  </span>
                )}
                {size && (
                  <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
                    Size: {size}{" "}
                    <span
                      role="button"
                      onClick={() => setSize(null)}
                      className="ms-1"
                    >
                      ×
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="row g-4">
            {/* Filters Column */}
            <div
              className={`col-lg-3 ${
                showFilters || window.innerWidth >= 992 ? "d-block" : "d-none"
              }`}
            >
              <div className="sticky-top" style={{ top: "20px" }}>
                <FilterSection title="Brand">
                  {["PUMA", "NIKE", "CAMPUS", "ADIDAS", "REEBOK"].map(
                    (brand) => (
                      <div className="form-check custom-checkbox" key={brand}>
                        <input
                          className="form-check-input border-primary"
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          id={`brand-${brand}`}
                        />
                        <label
                          className="form-check-label d-flex justify-content-between align-items-center"
                          htmlFor={`brand-${brand}`}
                        >
                          <span>{brand}</span>
                          <span className="badge rounded-pill bg-light text-dark">
                            {products.filter((p) => p.brand === brand).length}
                          </span>
                        </label>
                      </div>
                    )
                  )}
                </FilterSection>

                <FilterSection title="Price Range">
                  {[
                    {
                      label: "₹500 - ₹1,000",
                      value: "500-1000",
                    },
                    {
                      label: "₹1,000 - ₹1,500",
                      value: "1000-1500",
                    },
                    {
                      label: "₹1,500 - ₹2,000",
                      value: "1500-2000",
                    },
                    {
                      label: "Above ₹2,000",
                      value: "2000above",
                    },
                  ].map((range) => (
                    <div className="form-check" key={range.value}>
                      <input
                        className="form-check-input border-primary"
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

                <FilterSection title="Shoe Type">
                  {["Sports", "Casual", "Running", "Basketball", "Cricket"].map(
                    (type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input border-primary"
                          type="radio"
                          name="shoeType"
                          checked={shoeType === type}
                          onChange={() => handleShoeTypeChange(type)}
                          id={`shoeType-${type}`}
                        />
                        <label
                          className="form-check-label d-flex justify-content-between align-items-center"
                          htmlFor={`shoeType-${type}`}
                        >
                          <span>{type}</span>
                          <span className="badge rounded-pill bg-light text-dark">
                            {products.filter((p) => p.shoeType === type).length}
                          </span>
                        </label>
                      </div>
                    )
                  )}
                </FilterSection>

                <FilterSection title="Size">
                  <div className="d-flex flex-wrap gap-2">
                    {["8", "9", "10", "11"].map((sizeOption) => (
                      <div
                        key={sizeOption}
                        className={`size-option border rounded-circle d-flex align-items-center justify-content-center ${
                          size === sizeOption ? "bg-primary text-white" : ""
                        }`}
                        style={{
                          width: "40px",
                          height: "40px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleSizeChange(
                            size === sizeOption ? null : sizeOption
                          )
                        }
                      >
                        {sizeOption}
                      </div>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              {/* Sort and results info */}
              <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
                <p className="mb-0">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    id="sortDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Sort By
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                    <li>
                      <a className="dropdown-item" href="#">
                        Price: Low to High
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Price: High to Low
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Popularity
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Best Rating
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="row g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="col-sm-6 col-lg-4">
                      <div className="card h-100 border-0 product-card shadow-sm">
                        <div className="position-relative product-img-container">
                          <img
                            src={product.image}
                            className="card-img-top p-3"
                            style={{ height: "200px", objectFit: "contain" }}
                            alt={product.name}
                          />
                          <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill fw-bold">
                            {product.discount}% OFF
                          </span>
                          <div className="product-overlay d-flex justify-content-center align-items-center">
                            {/* Updated Link to navigate to ShoeDetail component */}
                            <Link
                              to={`/shoe/${product.id}`}
                              className="btn btn-primary rounded-pill px-4 me-2"
                            >
                              View Details
                            </Link>
                            <button 
                              className="btn btn-outline-light rounded-circle"
                              onClick={() => handleAddToCart(product)}
                              disabled={addingToCart === product.id}
                            >
                              {addingToCart === product.id ? (
                                <Loader size={18} className="animate-spin" />
                              ) : (
                                <ShoppingCart size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="card-body pt-0">
                          <div className="d-flex justify-content-between">
                            <p className="text-uppercase fw-bold mb-1 text-primary small">
                              {product.brand}
                            </p>
                            <div className="d-flex">
                              {renderRatingStars(product.rating)}
                            </div>
                          </div>
                          <h5
                            className="card-title text-truncate mb-1"
                            title={product.name}
                          >
                            {product.name}
                          </h5>
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fs-5 fw-bold text-primary">
                              ₹{product.discountedPrice}
                            </span>
                            <span className="text-decoration-line-through text-muted small">
                              ₹{product.originalPrice}
                            </span>
                          </div>
                          <p className="small text-muted mb-0">
                            {product.shoeType} • Size: {product.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 py-5 text-center">
                    <div className="py-5">
                      <Search size={48} className="text-muted mb-3" />
                      <h4>No products found</h4>
                      <p className="text-muted">
                        Try adjusting your filters to find what you're looking
                        for.
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={resetFilters}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function ProductDetails() {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Add state for cart operations
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Use the state from location if available
        if (location.state) {
          setProduct(location.state);
          setSelectedSize(location.state.size);

          // Fetch related products
          const response = await fetch("http://localhost:5000/Shoes");
          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }
          const allProducts = await response.json();
          const related = allProducts
            .filter(
              (p) =>
                p.id !== location.state.id &&
                p.shoeType === location.state.shoeType
            )
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          // Get product ID from URL if state is not available
          const pathSegments = location.pathname.split("/");
          const productId = parseInt(pathSegments[pathSegments.length - 1]);

          const response = await fetch("http://localhost:5000/Shoes");
          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }
          const allProducts = await response.json();

          const foundProduct = allProducts.find((p) => p.id === productId);
          if (!foundProduct) {
            throw new Error("Product not found");
          }

          setProduct(foundProduct);
          setSelectedSize(foundProduct.size);

          // Get related products
          const related = allProducts
            .filter(
              (p) => p.id !== productId && p.shoeType === foundProduct.shoeType
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    
  // Add to cart functionality
  const handleAddToCart = async () => {
    if (!product || addingToCart || !selectedSize) return;
    
    try {
      setAddingToCart(true);
      
      // Prepare cart item data
      const cartItem = {
        productId: `shoe_${product.id}_${selectedSize}`,
        name: product.name,
        price: product.discountedPrice,
        quantity: quantity,
        image: product.image,
        color: product.color || '',
        size: selectedSize,
        category: 'Shoes',
        brand: product.brand,
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
        text: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to your cart!`,
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
      setAddingToCart(false);
    }
  };
  
  // Add to cart functionality for related products
  const handleRelatedAddToCart = async (product) => {
    if (addingToCart) return; // Prevent multiple simultaneous adds
    
    try {
      setAddingToCart(true);
      
      // Prepare cart item data
      const cartItem = {
        productId: `shoe_${product.id}`,
        name: product.name,
        price: product.discountedPrice,
        quantity: 1,
        image: product.image,
        color: product.color || '',
        size: product.size || '',
        category: 'Shoes',
        brand: product.brand,
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
        text: `Added ${product.name} to your cart!`,
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
      setAddingToCart(false);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<Star key={i} className="text-warning" size={20} />);
      } else if (i === Math.floor(rating) && rating % 1 !== 0) {
        stars.push(<StarHalf key={i} className="text-warning" size={20} />);
      } else {
        stars.push(<Star key={i} className="text-muted" size={20} />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error || "Product not found"}
          </div>
          <Link to="/" className="btn btn-primary mt-3">
            Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
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
        
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                Men's Shoes
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">
                {product.brand}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          <div className="col-md-6">
            <div className="product-gallery card border-0 shadow-sm p-3 mb-4">
              <div className="position-relative mb-3">
                <img
                  src={product.image}
                  className="img-fluid rounded"
                  alt={product.name}
                />
                <span className="position-absolute top-0 end-0 bg-danger text-white px-3 py-2 m-3 rounded-pill fw-bold">
                  {product.discount}% OFF
                </span>
              </div>
              <div className="row g-2">
                <div className="col-3">
                  <img src={product.image} className="img-thumbnail" alt="" />
                </div>
                <div className="col-3">
                  <img src={product.image} className="img-thumbnail" alt="" />
                </div>
                <div className="col-3">
                  <img src={product.image} className="img-thumbnail" alt="" />
                </div>
                <div className="col-3">
                  <img src={product.image} className="img-thumbnail" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <h1 className="fw-bold mb-2">{product.name}</h1>
            <p className="text-uppercase fw-bold text-primary mb-3">
              {product.brand}
            </p>

            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="d-flex">{renderRatingStars(product.rating)}</div>
              <span className="text-muted">
                ({Math.floor(Math.random() * 500) + 50} Reviews)
              </span>
            </div>

            <div className="mb-4">
              <span className="fs-2 fw-bold text-primary me-3">
                ₹{product.discountedPrice}
              </span>
              <span className="text-decoration-line-through text-muted fs-5">
                ₹{product.originalPrice}
              </span>
              <span className="badge bg-danger ms-2 fs-6">
                SAVE ₹{product.originalPrice - product.discountedPrice}
              </span>
            </div>

            <p className="text-muted mb-4">
              Premium quality {product.shoeType.toLowerCase()} shoes by{" "}
              {product.brand}. Designed for comfort and performance.
            </p>

            <div className="mb-4">
              <h5 className="fw-bold mb-3">Select Size</h5>
              <div className="d-flex flex-wrap gap-2">
                {["8", "9", "10", "11"].map((sizeOption) => (
                  <div
                    key={sizeOption}
                    className={`size-box border rounded d-flex align-items-center justify-content-center ${
                      selectedSize === sizeOption ? "bg-primary text-white" : ""
                    }`}
                    style={{ width: "50px", height: "50px", cursor: "pointer" }}
                    onClick={() => setSelectedSize(sizeOption)}
                  >
                    {sizeOption}
                  </div>
                ))}
              </div>
              {!selectedSize && (
                <div className="text-danger mt-2 small">
                  Please select a size
                </div>
              )}
            </div>

            <div className="mb-4">
              <h5 className="fw-bold mb-3">Quantity</h5>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-secondary"
                  onClick={decrementQuantity}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center mx-2"
                  style={{ maxWidth: "70px" }}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
            </div>

            <div className="d-grid gap-2 d-md-flex mb-4">
              <button 
                className="btn btn-primary btn-lg flex-grow-1"
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize}
              >
                {addingToCart ? (
                  <>
                    <Loader size={20} className="me-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} className="me-2" />
                    Add to Cart
                  </>
                )}
              </button>
              <button className="btn btn-outline-primary btn-lg">
                Buy Now
              </button>
            </div>

            <div className="border-top pt-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold">Shoe Type:</span>
                <span>{product.shoeType}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold">Product ID:</span>
                <span>#{product.id.toString().padStart(5, "0")}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="fw-bold">Availability:</span>
                <span className="text-success">In Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-5">
          <h3 className="fw-bold mb-4">Related Products</h3>
          <div className="row g-4">
            {relatedProducts.map((product) => (
              <div key={product.id} className="col-sm-6 col-lg-3">
                <div className="card h-100 border-0 product-card shadow-sm">
                  <div className="position-relative product-img-container">
                    <img
                      src={product.image}
                      className="card-img-top p-3"
                      style={{ height: "180px", objectFit: "contain" }}
                      alt={product.name}
                    />
                    <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill fw-bold">
                      {product.discount}% OFF
                    </span>
                    <div className="product-overlay d-flex justify-content-center align-items-center">
                      <Link
                        to={`/product/${product.brand.toLowerCase()}/${
                          product.id
                        }`}
                        state={product}
                        className="btn btn-primary rounded-pill px-4 me-2"
                      >
                        View Details
                      </Link>
                      <button 
                        className="btn btn-outline-light rounded-circle"
                        onClick={() => handleRelatedAddToCart(product)}
                        disabled={addingToCart}
                      >
                        {addingToCart ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <p className="text-uppercase fw-bold mb-1 text-primary small">
                      {product.brand}
                    </p>
                    <h5
                      className="card-title text-truncate mb-1"
                      title={product.name}
                    >
                      {product.name}
                    </h5>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fs-5 fw-bold text-primary">
                        ₹{product.discountedPrice}
                      </span>
                      <span className="text-decoration-line-through text-muted small">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                    <div className="d-flex mt-2">
                      {renderRatingStars(product.rating)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      {/* Custom CSS */}
      <style jsx>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .product-img-container {
          overflow: hidden;
          position: relative;
        }
        .product-overlay {
          position: absolute;
          bottom: -60px;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px;
          transition: bottom 0.3s ease;
          opacity: 0;
        }
        .product-card:hover .product-overlay {
          bottom: 0;
          opacity: 1;
        }
        .size-box {
          transition: all 0.2s ease;
        }
        .size-box:hover:not(.bg-primary) {
          border-color: var(--bs-primary) !important;
          color: var(--bs-primary);
        }
        .nav-tabs .nav-link.active {
          font-weight: bold;
          color: var(--bs-primary);
          border-bottom-color: var(--bs-primary);
        }
      `}</style>
    </>
  );
}

export { AllShoe, ProductDetails };
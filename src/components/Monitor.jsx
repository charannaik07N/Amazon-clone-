import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  useNavigate,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

const Monitor = () => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [displaySize, setDisplaySize] = useState([]);
  const [resolution, setResolution] = useState([]);
  const [formFactor, setFormFactor] = useState([]);
  const [products, setProducts] = useState([]); // Added products state
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  // Filter handlers remain the same
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleDisplaySizeChange = (size) => {
    setDisplaySize((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleResolutionChange = (res) => {
    setResolution((prev) =>
      prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res]
    );
  };

  const handleFormFactorChange = (factor) => {
    setFormFactor((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  // Fixed navigate to match the routing structure
  const handleLearnMore = (id) => {
    navigate(`/Monitor/${id}`);
  };

  // Function to add product to cart
  const handleAddToCart = async (product) => {
    if (!product) return;

    // Update local state to show loading
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id ? { ...p, addingToCart: true } : p
      )
    );

    try {
      // Prepare cart item data
      const cartItem = {
        productId: `monitor_${product.id}`,
        name: product.name,
        price: parseFloat(product.price) || 0,
        quantity: 1,
        image: product.image,
        color: product.color || '',
        size: product.displaySize || '',
        category: 'Monitors',
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
      // Reset loading state
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, addingToCart: false } : p
        )
      );
    }
  };

  // Moved useEffect before it's used in the component
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/Monitors");
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        
        // Add addingToCart property to each product
        const productsWithCartState = data.map(product => ({
          ...product,
          addingToCart: false
        }));
        
        setProducts(productsWithCartState);
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

  const filteredProducts = products.filter((product) => {
    const matchesBrand =
      !selectedBrands.length || selectedBrands.includes(product.brand);
    const matchesPrice =
      !priceRange ||
      (priceRange === "0-10000" && product.price <= 10000) ||
      (priceRange === "10001-20000" &&
        product.price > 10000 &&
        product.price <= 20000) ||
      (priceRange === "20001-30000" &&
        product.price > 20000 &&
        product.price <= 30000) ||
      (priceRange === "30001+" && product.price > 30000);
    const matchesDisplaySize =
      !displaySize.length || displaySize.includes(product.displaySize);
    const matchesResolution =
      !resolution.length || resolution.includes(product.resolution);
    const matchesFormFactor =
      !formFactor.length || formFactor.includes(product.formFactor);

    return (
      matchesBrand &&
      matchesPrice &&
      matchesDisplaySize &&
      matchesResolution &&
      matchesFormFactor
    );
  });

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light py-4">
        <div className="row">
          {/* Sidebar with improved styling */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title border-bottom pb-3 mb-3">Filters</h5>

                {/* Brand Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Brand</h6>
                  {["BenQ", "LG", "Samsung", "Asus", "Acer", "Dell"].map(
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
                          className="form-check-label"
                          htmlFor={`brand-${brand}`}
                        >
                          {brand}
                        </label>
                      </div>
                    )
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Price Range</h6>
                  {["0-10000", "10001-20000", "20001-30000", "30001+"].map(
                    (range) => (
                      <div className="form-check mb-2" key={range}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="priceRange"
                          id={`price-${range}`}
                          checked={priceRange === range}
                          onChange={() => setPriceRange(range)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`price-${range}`}
                        >
                          ₹{range}
                        </label>
                      </div>
                    )
                  )}
                </div>

                {/* Other filters with similar styling */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Display Size</h6>
                  {[
                    "23 inch - 24.9 inch",
                    "25 inch - 27 inch",
                    "27 inch and above",
                  ].map((size) => (
                    <div className="form-check mb-2" key={size}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`size-${size}`}
                        checked={displaySize.includes(size)}
                        onChange={() => handleDisplaySizeChange(size)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`size-${size}`}
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Resolution Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Screen Resolution</h6>
                  {["Full HD", "Quad HD", "UHD"].map((res) => (
                    <div className="form-check mb-2" key={res}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`res-${res}`}
                        checked={resolution.includes(res)}
                        onChange={() => handleResolutionChange(res)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`res-${res}`}
                      >
                        {res}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Form Factor Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Screen Form Factor</h6>
                  {["Curved", "Flat"].map((factor) => (
                    <div className="form-check mb-2" key={factor}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`factor-${factor}`}
                        checked={formFactor.includes(factor)}
                        onChange={() => handleFormFactorChange(factor)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`factor-${factor}`}
                      >
                        {factor}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product List with improved styling */}
          <div className="col-lg-9">
            {/* Cart message alert */}
            {cartMessage.show && (
              <div className={`alert alert-${cartMessage.type} alert-dismissible fade show mb-4`} role="alert">
                {cartMessage.text}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setCartMessage({ ...cartMessage, show: false })}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading products...</p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Products display */}
            {!loading && !error && (
              <div className="row row-cols-1 g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="col">
                      <div className="card shadow-sm h-100 hover-shadow transition-all">
                        <div className="row g-0">
                          <div className="col-md-4">
                            <div className="p-3 h-100 d-flex align-items-center">
                              <img
                                src={product.image}
                                className="img-fluid rounded object-fit-cover"
                                alt={product.name}
                              />
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div className="card-body">
                              <h5 className="card-title fw-bold mb-3">
                                {product.name}
                              </h5>
                              <div className="d-flex align-items-center mb-3">
                                <span className="fs-4 fw-bold text-primary me-2">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                <span className="text-decoration-line-through text-muted me-2">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                                <span className="badge bg-success">
                                  {product.discount}% OFF
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="badge bg-warning text-dark me-2">
                                  {product.rating} ★
                                </span>
                              </div>
                              <div className="border-top pt-3">
                                <h6 className="fw-bold mb-2">Key Features:</h6>
                                <div className="row row-cols-2">
                                  {product.features.map((feature, index) => (
                                    <div key={index} className="col mb-2">
                                      <small className="text-muted">
                                        <i className="bi bi-check2-circle me-1"></i>
                                        {feature}
                                      </small>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-3">
                                <button 
                                  className="btn btn-primary me-2"
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.addingToCart}
                                >
                                  {product.addingToCart ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                      Adding...
                                    </>
                                  ) : (
                                    "Add to Cart"
                                  )}
                                </button>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleLearnMore(product.id)}
                                >
                                  Learn More
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col">
                    <div className="alert alert-info">
                      No products match your selected filters. Try adjusting
                      your criteria.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Monitor;
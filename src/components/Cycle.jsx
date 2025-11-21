import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Star,
  StarHalf,
  Bike,
  Filter,
  Search,
  Loader,
  ShoppingCart,
} from "lucide-react";

function Cycle() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [cycleType, setCycleType] = useState(null);
  const [gearType, setGearType] = useState(null);
  const [ageGroup, setAgeGroup] = useState(null);
  
  // Add state for cart operations
  const [addingToCart, setAddingToCart] = useState(null); // Store product ID being added
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  // Fetch data from API
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/cycle");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching cycles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, []);

  // Get unique values for filters
  const uniqueBrands = [...new Set(products.map((p) => p.brand))];
  const uniqueTypes = [...new Set(products.map((p) => p.type))];
  const uniqueGearTypes = [...new Set(products.map((p) => p.gearType))];
  const uniqueAgeGroups = [...new Set(products.map((p) => p.ageGroup))];

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };
  
  // Add to cart functionality
  const handleAddToCart = async (product) => {
    if (addingToCart) return; // Prevent multiple simultaneous adds
    
    try {
      setAddingToCart(product.id);
      
      // Calculate discounted price
      const discountedPrice = getDiscountedPrice(product.price, product.discount);
      
      // Prepare cart item data
      const cartItem = {
        productId: `cycle_${product.id}`,
        name: product.name,
        price: discountedPrice,
        quantity: 1,
        image: product.image,
        color: product.color || '',
        size: product.frameSize || '',
        category: 'Cycles',
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
    // Brand filter
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    // Price filter - using actual price ranges for cycles
    const discountedPrice = getDiscountedPrice(product.price, product.discount);
    const matchesPrice =
      !priceRange ||
      (priceRange === "0-5000" && discountedPrice <= 5000) ||
      (priceRange === "5001-10000" &&
        discountedPrice > 5000 &&
        discountedPrice <= 10000) ||
      (priceRange === "10001-15000" &&
        discountedPrice > 10000 &&
        discountedPrice <= 15000) ||
      (priceRange === "15000above" && discountedPrice > 15000);

    // Type filter
    const matchesType = !cycleType || product.type === cycleType;

    // Gear type filter
    const matchesGearType = !gearType || product.gearType === gearType;

    // Age group filter
    const matchesAgeGroup = !ageGroup || product.ageGroup === ageGroup;

    return (
      matchesBrand &&
      matchesPrice &&
      matchesType &&
      matchesGearType &&
      matchesAgeGroup
    );
  });

  const FilterSection = ({ title, children }) => (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-gradient bg-primary text-white border-0">
        <h6 className="mb-0 fw-semibold">
          <Filter size={16} className="me-2" />
          {title}
        </h6>
      </div>
      <div className="card-body p-3">{children}</div>
    </div>
  );

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setCycleType(null);
    setGearType(null);
    setAgeGroup(null);
  };

  const renderRatingStars = (rating) => {
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container-fluid bg-light py-5">
          <div className="container">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "60vh" }}
            >
              <div className="text-center">
                <Loader
                  className="spinner-border text-primary mb-3"
                  size={48}
                />
                <h4 className="text-muted">Loading Cycles...</h4>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container-fluid bg-light py-5">
          <div className="container">
            <div className="alert alert-danger text-center">
              <h4>Error loading data</h4>
              <p>{error}</p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light py-4">
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
          <div className="row mb-4">
            <div className="col-12">
              <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <Bike className="text-white" size={32} />
                    </div>
                    <div>
                      <h1 className="mb-1 text-primary fw-bold">Cycles</h1>
                      <p className="text-muted mb-0">
                        Find your perfect ride for every adventure
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5 className="text-primary mb-0">
                      {filteredProducts.length}
                    </h5>
                    <small className="text-muted">Cycles Available</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Filters Column */}
            <div className="col-lg-3">
              <div className="sticky-top" style={{ top: "20px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-dark mb-0">Filters</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>

                <FilterSection title="Brand">
                  {uniqueBrands.map((brand) => (
                    <div className="form-check mb-2" key={brand}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        id={`brand-${brand}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`brand-${brand}`}
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Price Range">
                  {[
                    { label: "₹0 - ₹5,000", value: "0-5000" },
                    { label: "₹5,001 - ₹10,000", value: "5001-10000" },
                    { label: "₹10,001 - ₹15,000", value: "10001-15000" },
                    { label: "Above ₹15,000", value: "15000above" },
                  ].map((range) => (
                    <div className="form-check mb-2" key={range.value}>
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

                <FilterSection title="Cycle Type">
                  {uniqueTypes.map((type) => (
                    <div className="form-check mb-2" key={type}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="cycleType"
                        checked={cycleType === type}
                        onChange={() => setCycleType(type)}
                        id={`type-${type}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`type-${type}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Gear Type">
                  {uniqueGearTypes.map((type) => (
                    <div className="form-check mb-2" key={type}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gearType"
                        checked={gearType === type}
                        onChange={() => setGearType(type)}
                        id={`gear-${type}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`gear-${type}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Age Group">
                  {uniqueAgeGroups.map((group) => (
                    <div className="form-check mb-2" key={group}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ageGroup"
                        checked={ageGroup === group}
                        onChange={() => setAgeGroup(group)}
                        id={`age-${group}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`age-${group}`}
                      >
                        {group}
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
                  filteredProducts.map((product) => (
                    <div key={product.id} className="col-md-6 col-xl-4">
                      <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden">
                        <div className="position-relative">
                          <img
                            src={product.image}
                            className="card-img-top"
                            style={{
                              height: "220px",
                              objectFit: "contain",
                              padding: "15px",
                            }}
                            alt={product.name}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">
                              {product.discount}% OFF
                            </span>
                          </div>
                        </div>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-2 fw-bold text-dark">
                            {product.name}
                          </h5>
                          <p className="text-primary fw-semibold mb-3">
                            {product.brand}
                          </p>

                          {product.rating && (
                            <div className="mb-3">
                              {renderRatingStars(product.rating)}
                            </div>
                          )}

                          <div className="d-flex align-items-center gap-3 mb-3">
                            <span className="text-decoration-line-through text-muted fs-6">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span className="fs-4 fw-bold text-primary">
                              ₹
                              {getDiscountedPrice(
                                product.price,
                                product.discount
                              ).toLocaleString()}
                            </span>
                          </div>

                          <div className="small text-muted mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span>Type:</span>
                              <span className="fw-medium">{product.type}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <span>Gear:</span>
                              <span className="fw-medium">
                                {product.gearType}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <span>Age Group:</span>
                              <span className="fw-medium">
                                {product.ageGroup}
                              </span>
                            </div>
                          </div>

                          <div className="border-top pt-3">
                            <div className="row text-center">
                              <div className="col-6">
                                <small className="text-muted d-block">
                                  Front Brake
                                </small>
                                <span className="fw-medium small">
                                  {product.frontBrake}
                                </span>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block">
                                  Rear Brake
                                </small>
                                <span className="fw-medium small">
                                  {product.rearBrake}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-transparent border-0 p-4 pt-0">
                          <button 
                            className="btn btn-primary w-100 fw-semibold py-2"
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
                                <ShoppingCart size={16} className="me-2" />
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div className="bg-white rounded-3 shadow-sm p-5">
                        <Search className="text-muted mb-3" size={64} />
                        <h4 className="text-muted mb-2">No cycles found</h4>
                        <p className="text-muted mb-4">
                          No cycles match your current filter criteria.
                        </p>
                        <button
                          className="btn btn-primary px-4"
                          onClick={clearAllFilters}
                        >
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
    </>
  );
}

export default Cycle;
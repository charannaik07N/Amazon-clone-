import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Star, StarHalf, ShoppingCart, Info } from "lucide-react";

function Lights() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Initialize products state
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [error, setError] = useState(null); // Initialize error state
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [discountRange, setDiscountRange] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [wattsRange, setWattsRange] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  // Fetch products from server when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/lights");
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();

        // Validate and sanitize product data - FIXED PROPERTY MAPPING
        const validatedProducts = data.map((product) => ({
          ...product,
          // Map API properties to component properties
          price: parseFloat(product.originalPrice) || 0, // Use originalPrice from API
          discountedPrice: parseFloat(product.discountedPrice) || 0, // Use discountedPrice from API
          discount: parseFloat(product.discount) || 0,
          rating: parseFloat(product.rating) || 4.5, // Default rating since API doesn't have it
          watts: parseFloat(product.watts?.replace("W", "")) || 0, // Remove 'W' and convert to number
          features: Array.isArray(product.features) ? product.features : [],
          brand: product.brand || "Unknown",
          name: product.name || "Unnamed Product",
          image: product.image || "/placeholder-image.jpg",
          addingToCart: false, // Add state for tracking cart operation
        }));

        setProducts(validatedProducts);
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
        productId: `light_${product.id}`,
        name: product.name,
        price: parseFloat(product.discountedPrice) || parseFloat(product.price) || 0,
        quantity: 1,
        image: product.image,
        color: product.color || '',
        size: product.size || '',
        category: 'Lights',
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

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  const handleFeatureChange = (feature) => {
    setSelectedFeatures((prevSelected) =>
      prevSelected.includes(feature)
        ? prevSelected.filter((f) => f !== feature)
        : [...prevSelected, feature]
    );
  };

  const handlePriceChange = (range) => setPriceRange(range);
  const handleDiscountChange = (range) => setDiscountRange(range);
  const handleWattsChange = (range) => setWattsRange(range);
  const handleSortChange = (e) => setSortBy(e.target.value);

  // UPDATED: Use the discountedPrice directly from API instead of calculating
  const getDiscountedPrice = (product) => {
    return parseFloat(product.discountedPrice) || 0;
  };

  const navigateToDetails = (id, brand) => {
    navigate(`/lights/${brand.toLowerCase()}/${id}`);
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setDiscountRange(null);
    setSelectedFeatures([]);
    setWattsRange(null);
    setSortBy("featured");
  };

  // Get unique values only if products are loaded
  const uniqueBrands =
    products.length > 0
      ? [...new Set(products.map((product) => product.brand).filter(Boolean))]
      : [];

  const uniqueFeatures =
    products.length > 0
      ? [
          ...new Set(
            products
              .flatMap((product) => product.features || [])
              .filter(Boolean)
          ),
        ]
      : [];

  // Filter products - UPDATED to use correct price property
  let filteredProducts = products.filter((product) => {
    const discountedPrice = getDiscountedPrice(product);

    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    const matchesPrice =
      !priceRange ||
      (priceRange === "500-1000" &&
        discountedPrice >= 500 &&
        discountedPrice <= 1000) ||
      (priceRange === "1001-2500" &&
        discountedPrice > 1000 &&
        discountedPrice <= 2500) ||
      (priceRange === "2501-5000" &&
        discountedPrice > 2500 &&
        discountedPrice <= 5000) ||
      (priceRange === "5000above" && discountedPrice > 5000);

    const matchesDiscount =
      !discountRange ||
      (discountRange === "0-20" &&
        (product.discount || 0) >= 0 &&
        (product.discount || 0) <= 20) ||
      (discountRange === "21-40" &&
        (product.discount || 0) > 20 &&
        (product.discount || 0) <= 40) ||
      (discountRange === "41-60" &&
        (product.discount || 0) > 40 &&
        (product.discount || 0) <= 60) ||
      (discountRange === "60above" && (product.discount || 0) > 60);

    const matchesFeatures =
      selectedFeatures.length === 0 ||
      selectedFeatures.some((feature) => product.features?.includes(feature));

    const matchesWatts =
      !wattsRange ||
      (wattsRange === "5-15" &&
        (product.watts || 0) >= 5 &&
        (product.watts || 0) <= 15) ||
      (wattsRange === "16-30" &&
        (product.watts || 0) > 15 &&
        (product.watts || 0) <= 30) ||
      (wattsRange === "31-50" &&
        (product.watts || 0) > 30 &&
        (product.watts || 0) <= 50) ||
      (wattsRange === "50above" && (product.watts || 0) > 50);

    return (
      matchesBrand &&
      matchesPrice &&
      matchesDiscount &&
      matchesFeatures &&
      matchesWatts
    );
  });

  // Sort products - UPDATED to use correct price property
  if (sortBy === "price-low") {
    filteredProducts.sort(
      (a, b) => getDiscountedPrice(a) - getDiscountedPrice(b)
    );
  } else if (sortBy === "price-high") {
    filteredProducts.sort(
      (a, b) => getDiscountedPrice(b) - getDiscountedPrice(a)
    );
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "discount") {
    filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  } else if (sortBy === "watts") {
    filteredProducts.sort((a, b) => (b.watts || 0) - (a.watts || 0));
  }

  const renderRatingStars = (rating) => {
    const safeRating = parseFloat(rating) || 0;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(safeRating)) {
        stars.push(
          <Star
            key={i}
            className="text-warning"
            size={16}
            fill="currentColor"
          />
        );
      } else if (i === Math.floor(safeRating) && safeRating % 1 !== 0) {
        stars.push(
          <StarHalf
            key={i}
            className="text-warning"
            size={16}
            fill="currentColor"
          />
        );
      } else {
        stars.push(<Star key={i} className="text-muted" size={16} />);
      }
    }
    return stars;
  };

  const FilterSection = ({ title, children }) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-header bg-primary text-white">
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
          <div className="row mb-4">
            <div className="col-md-6">
              <h1 className="mb-0 text-primary fw-bold">Premium Lights</h1>
              <p className="text-muted">Illuminate your space with style</p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end align-items-center">
                <label htmlFor="sort-by" className="me-2">
                  Sort by:
                </label>
                <select
                  id="sort-by"
                  className="form-select w-auto"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="watts">Highest Watts</option>
                </select>
              </div>
            </div>
          </div>

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

          {/* Show loading state */}
          {loading && (
            <div className="alert alert-info text-center">
              <div className="spinner-border text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Loading lights, please wait...
            </div>
          )}

          {/* Show error message if any */}
          {error && (
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Main content when not loading and no errors */}
          {!loading && !error && (
            <div className="row g-4">
              {/* Filters Column */}
              <div className="col-lg-3">
                <div className="sticky-top" style={{ top: "20px" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">Filters</h5>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleClearFilters}
                    >
                      Clear All
                    </button>
                  </div>

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
                      { label: "₹1,001 - ₹2,500", value: "1001-2500" },
                      { label: "₹2,501 - ₹5,000", value: "2501-5000" },
                      { label: "Above ₹5,000", value: "5000above" },
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

                  <FilterSection title="Discount">
                    {[
                      { label: "0% - 20%", value: "0-20" },
                      { label: "21% - 40%", value: "21-40" },
                      { label: "41% - 60%", value: "41-60" },
                      { label: "Above 60%", value: "60above" },
                    ].map((range) => (
                      <div className="form-check" key={range.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="discount"
                          checked={discountRange === range.value}
                          onChange={() => handleDiscountChange(range.value)}
                          id={`discount-${range.value}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`discount-${range.value}`}
                        >
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </FilterSection>

                

                  <FilterSection title="Watts">
                    {[
                      { label: "5W - 15W", value: "5-15" },
                      { label: "16W - 30W", value: "16-30" },
                      { label: "31W - 50W", value: "31-50" },
                      { label: "Above 50W", value: "50above" },
                    ].map((range) => (
                      <div className="form-check" key={range.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="watts"
                          checked={wattsRange === range.value}
                          onChange={() => handleWattsChange(range.value)}
                          id={`watts-${range.value}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`watts-${range.value}`}
                        >
                          {range.label}
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
                      // UPDATED: Use correct property names from API
                      const originalPrice = parseFloat(product.price) || 0; // This is originalPrice from API
                      const discountPercent = parseFloat(product.discount) || 0;
                      const discountedPrice =
                        parseFloat(product.discountedPrice) || 0; // Use API's discountedPrice
                      const safeRating = parseFloat(product.rating) || 4.5;
                      const safeWatts = parseFloat(product.watts) || 0;

                      return (
                        <div key={product.id} className="col-md-6 col-lg-4">
                          <div className="card h-100 shadow border-0 transition-all">
                            <div className="position-relative">
                              <img
                                src={product.image}
                                className="card-img-top p-3"
                                style={{
                                  height: "200px",
                                  objectFit: "contain",
                                }}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                              {discountPercent > 0 && (
                                <span className="position-absolute top-0 end-0 badge bg-danger px-2 py-1 m-2 rounded-pill">
                                  {Math.round(discountPercent)}% OFF
                                </span>
                              )}
                            </div>
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title mb-1 text-truncate">
                                {product.name}
                              </h5>
                              <p className="text-muted small mb-2">
                                {product.brand}
                              </p>
                              <div className="mb-2 d-flex align-items-center">
                                <div className="d-flex">
                                  {renderRatingStars(safeRating)}
                                </div>
                                <span className="ms-1 text-muted small">
                                  ({safeRating.toFixed(1)})
                                </span>
                              </div>

                              {/* Price Section - UPDATED */}
                              <div className="mb-3">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <span className="fs-5 fw-bold text-primary">
                                    ₹{discountedPrice.toLocaleString("en-IN")}
                                  </span>
                                  {discountPercent > 0 && (
                                    <span className="text-decoration-line-through text-muted small">
                                      ₹{originalPrice.toLocaleString("en-IN")}
                                    </span>
                                  )}
                                </div>
                                {discountPercent > 0 && (
                                  <div className="small text-success fw-medium">
                                    You save ₹
                                    {(
                                      originalPrice - discountedPrice
                                    ).toLocaleString("en-IN")}
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="small text-muted mb-3">
                                <div className="mb-1">
                                  <span className="badge bg-secondary me-1">
                                    {safeWatts}W
                                  </span>
                                </div>
                              </div>

                              {/* Features Section - Enhanced Visibility */}
                              {product.features &&
                                product.features.length > 0 && (
                                  <div className="mb-3">
                                    <h6 className="small fw-bold text-dark mb-2">
                                      Key Features:
                                    </h6>
                                    <div className="d-flex flex-wrap gap-1">
                                      {product.features
                                        .slice(0, 3)
                                        .map((feature, index) => (
                                          <span
                                            key={index}
                                            className="badge bg-light text-dark border small"
                                            style={{ fontSize: "0.7rem" }}
                                          >
                                            {feature}
                                          </span>
                                        ))}
                                      {product.features.length > 3 && (
                                        <span
                                          className="badge bg-primary small"
                                          style={{ fontSize: "0.7rem" }}
                                        >
                                          +{product.features.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Buttons - Push to bottom */}
                              <div className="mt-auto">
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-primary flex-grow-1 btn-sm"
                                    onClick={() =>
                                      navigateToDetails(
                                        product.id,
                                        product.brand
                                      )
                                    }
                                  >
                                    <Info size={14} className="me-1" />
                                    Details
                                  </button>
                                  <button 
                                    className="btn btn-outline-success flex-grow-1 btn-sm"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.addingToCart}
                                  >
                                    {product.addingToCart ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Adding...
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingCart size={14} className="me-1" />
                                        Add to Cart
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12">
                      <div className="alert alert-info text-center py-4">
                        <h4>No products found matching your criteria.</h4>
                        <p className="mb-0">
                          Try adjusting your filters to see more products.
                        </p>
                        <button
                          onClick={handleClearFilters}
                          className="btn btn-primary mt-3"
                        >
                          Clear Filters
                        </button>
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

export default Lights;
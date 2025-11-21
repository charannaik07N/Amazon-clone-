import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Star, StarHalf, ShoppingCart, Info } from "lucide-react";

function Cool() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [discountRange, setDiscountRange] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  // Fetch products from server when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/cool");
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();

        console.log("Raw API data:", data); // Debug log to see API structure

        // Fixed validation and sanitization - handle different possible field names
        const validatedProducts = data.map((product) => {
          // Handle different possible price field names from API
          const originalPrice = parseFloat(
            product.originalPrice ||
              product.price ||
              product.mrp ||
              product.original_price ||
              0
          );

          const discountedPrice = parseFloat(
            product.discountedPrice ||
              product.discounted_price ||
              product.salePrice ||
              product.sale_price ||
              product.currentPrice ||
              product.current_price ||
              originalPrice // fallback to original price if no discounted price
          );

          const discount = parseFloat(
            product.discount ||
              product.discountPercentage ||
              product.discount_percentage ||
              0
          );

          // Calculate discount if not provided but we have both prices
          let calculatedDiscount = discount;
          if (
            !discount &&
            originalPrice > 0 &&
            discountedPrice > 0 &&
            discountedPrice < originalPrice
          ) {
            calculatedDiscount =
              ((originalPrice - discountedPrice) / originalPrice) * 100;
          }

          return {
            ...product,
            // Use original field names for internal processing
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            discount: calculatedDiscount,
            rating: parseFloat(product.rating || product.averageRating || 4.5),
            features: Array.isArray(product.features) ? product.features : [],
            brand: product.brand || product.manufacturer || "Unknown",
            name:
              product.name ||
              product.title ||
              product.productName ||
              "Unnamed Product",
            image:
              product.image ||
              product.imageUrl ||
              product.thumbnail ||
              "https://via.placeholder.com/300x300/f8f9fa/6c757d?text=No+Image",
            addingToCart: false, // Add state for tracking cart operation
          };
        });

        console.log("Processed products:", validatedProducts); // Debug log
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
        productId: `cool_${product.id}`,
        name: product.name,
        price: parseFloat(product.discountedPrice) || parseFloat(product.originalPrice) || 0,
        quantity: 1,
        image: product.image,
        color: product.color || '',
        size: product.size || '',
        category: 'Cooling Products',
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
  const handleSortChange = (e) => setSortBy(e.target.value);

  // Fixed price getter function
  const getDiscountedPrice = (product) => {
    return (
      parseFloat(product.discountedPrice) ||
      parseFloat(product.originalPrice) ||
      0
    );
  };

  const getOriginalPrice = (product) => {
    return parseFloat(product.originalPrice) || 0;
  };

  // FIXED: Changed navigation path from /lights/ to /cool/ to match your routes
  const navigateToDetails = (id, brand) => {
    navigate(`/cool/${brand.toLowerCase()}/${id}`);
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setDiscountRange(null);
    setSelectedFeatures([]);
    setSortBy("featured");
  };

  // Image error handler function
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src =
      "https://via.placeholder.com/300x300/f8f9fa/6c757d?text=No+Image+Available";
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

  // Filter products
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

    return matchesBrand && matchesPrice && matchesDiscount && matchesFeatures;
  });

  // Sort products
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
              <h1 className="mb-0 text-primary fw-bold">Premium Cooling Products</h1>
              <p className="text-muted">Keep your devices cool and efficient</p>
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
              Loading cooling products, please wait...
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

                  {/* Features Filter - Added back */}
                  {uniqueFeatures.length > 0 && (
                    <FilterSection title="Features">
                      {uniqueFeatures.map((feature) => (
                        <div className="form-check" key={feature}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => handleFeatureChange(feature)}
                            id={`feature-${feature}`}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`feature-${feature}`}
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </FilterSection>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="col-lg-9">
                <div className="row g-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                      const originalPrice = getOriginalPrice(product);
                      const discountedPrice = getDiscountedPrice(product);
                      const discountPercent = parseFloat(product.discount) || 0;
                      const safeRating = parseFloat(product.rating) || 4.5;

                      return (
                        <div key={product.id} className="col-md-6 col-lg-4">
                          <div className="card h-100 shadow border-0 transition-all">
                            <div
                              className="position-relative bg-white"
                              style={{
                                height: "260px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              <img
                                src={product.image}
                                className="card-img-top"
                                style={{
                                  maxHeight: "220px",
                                  width: "auto",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                  margin: "0 auto",
                                  borderRadius: "10px",
                                  display: "block",
                                }}
                                alt={product.name}
                                onError={handleImageError}
                                loading="lazy"
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

                              {/* Fixed Price Section */}
                              <div className="mb-3">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <span className="fs-5 fw-bold text-primary">
                                    ₹{discountedPrice.toLocaleString("en-IN")}
                                  </span>
                                  {discountPercent > 0 &&
                                    originalPrice > discountedPrice && (
                                      <span className="text-decoration-line-through text-muted small">
                                        ₹{originalPrice.toLocaleString("en-IN")}
                                      </span>
                                    )}
                                </div>
                                {discountPercent > 0 &&
                                  originalPrice > discountedPrice && (
                                    <div className="small text-success fw-medium">
                                      You save ₹
                                      {(
                                        originalPrice - discountedPrice
                                      ).toLocaleString("en-IN")}
                                    </div>
                                  )}
                              </div>

                              {/* Features Section */}
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

                              {/* Buttons */}
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

export default Cool;
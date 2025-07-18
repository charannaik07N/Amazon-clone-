import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Star, StarHalf, ShoppingCart, Info } from "lucide-react";

function Headset() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Initialize products state
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [error, setError] = useState(null); // Initialize error state
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [connectivity, setConnectivity] = useState(null);
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products from server when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/Headset");
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

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  const handlePriceChange = (range) => setPriceRange(range);
  const handleConnectivityChange = (type) => setConnectivity(type);
  const handleSortChange = (e) => setSortBy(e.target.value);

  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  const navigateToDetails = (id, brand) => {
    navigate(`/headphones/${brand.toLowerCase()}/${id}`);
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setConnectivity(null);
    setSortBy("featured");
  };

  // Get unique brands and connectivity types only if products are loaded
  const uniqueBrands =
    products.length > 0
      ? [...new Set(products.map((product) => product.brand))]
      : [];

  const uniqueConnectivity =
    products.length > 0
      ? [...new Set(products.map((product) => product.connectivity))]
      : [];

  // Filter products
  let filteredProducts = products.filter((product) => {
    const discountedPrice = calculateDiscountedPrice(
      product.price,
      product.discount
    );

    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    const matchesPrice =
      !priceRange ||
      (priceRange === "1000-1500" &&
        discountedPrice >= 1000 &&
        discountedPrice <= 1500) ||
      (priceRange === "1501-5000" &&
        discountedPrice > 1500 &&
        discountedPrice <= 5000) ||
      (priceRange === "5001-10000" &&
        discountedPrice > 5000 &&
        discountedPrice <= 10000) ||
      (priceRange === "10000above" && discountedPrice > 10000);

    const matchesConnectivity =
      !connectivity ||
      product.connectivity.toLowerCase().includes(connectivity.toLowerCase());

    return matchesBrand && matchesPrice && matchesConnectivity;
  });

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts.sort(
      (a, b) =>
        calculateDiscountedPrice(a.price, a.discount) -
        calculateDiscountedPrice(b.price, b.discount)
    );
  } else if (sortBy === "price-high") {
    filteredProducts.sort(
      (a, b) =>
        calculateDiscountedPrice(b.price, b.discount) -
        calculateDiscountedPrice(a.price, a.discount)
    );
  } else if (sortBy === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "discount") {
    filteredProducts.sort((a, b) => b.discount - a.discount);
  }

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
              <h1 className="mb-0 text-primary fw-bold">Premium Headphones</h1>
              <p className="text-muted">Find your perfect audio companion</p>
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

          {/* Show loading state */}
          {loading && (
            <div className="alert alert-info text-center">
              <div className="spinner-border text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Loading headphones, please wait...
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
                      { label: "₹1,000 - ₹1,500", value: "1000-1500" },
                      { label: "₹1,501 - ₹5,000", value: "1501-5000" },
                      { label: "₹5,001 - ₹10,000", value: "5001-10000" },
                      { label: "Above ₹10,000", value: "10000above" },
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

                  <FilterSection title="Connectivity">
                    {uniqueConnectivity.map((type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="connectivity"
                          checked={connectivity === type}
                          onChange={() => handleConnectivityChange(type)}
                          id={`connectivity-${type}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`connectivity-${type}`}
                        >
                          {type}
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
                      const discountedPrice = calculateDiscountedPrice(
                        product.price,
                        product.discount
                      );
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
                              />
                              <span className="position-absolute top-0 end-0 badge bg-danger px-2 py-1 m-2 rounded-pill">
                                {product.discount}% OFF
                              </span>
                            </div>
                            <div className="card-body">
                              <h5 className="card-title mb-1 text-truncate">
                                {product.name}
                              </h5>
                              <p className="text-muted small mb-2">
                                {product.brand}
                              </p>
                              <div className="mb-2 d-flex">
                                {renderRatingStars(product.rating)}
                                <span className="ms-1 text-muted small">
                                  ({product.rating})
                                </span>
                              </div>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="text-decoration-line-through text-muted">
                                  ₹{product.price.toLocaleString()}
                                </span>
                                <span className="fs-5 fw-bold text-primary">
                                  ₹{discountedPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="small text-muted">
                                <div>
                                  <strong>Type:</strong> {product.connectivity}
                                </div>
                                <div className="text-truncate">
                                  <strong>Features:</strong>{" "}
                                  {product.features
                                    ? product.features.join(", ")
                                    : "N/A"}
                                </div>
                              </div>
                            </div>
                            <div className="card-footer bg-white border-top-0 d-flex gap-2">
                              <button
                                className="btn btn-primary flex-grow-1"
                                onClick={() =>
                                  navigateToDetails(product.id, product.brand)
                                }
                              >
                                <Info size={16} className="me-1" />
                                View Details
                              </button>
                              <button className="btn btn-outline-success flex-grow-1">
                                <ShoppingCart size={16} className="me-1" />
                                Add to Cart
                              </button>
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

                {/* Results count and pagination */}
                {filteredProducts.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      Showing <strong>{filteredProducts.length}</strong> out of{" "}
                      <strong>{products.length}</strong> products
                    </div>
                    <nav aria-label="Page navigation">
                      <ul className="pagination mb-0">
                        <li className="page-item disabled">
                          <a
                            className="page-link"
                            href="#"
                            tabIndex="-1"
                            aria-disabled="true"
                          >
                            Previous
                          </a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#">
                            1
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            2
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            3
                          </a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Headset;

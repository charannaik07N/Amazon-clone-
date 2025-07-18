import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Star,
  StarHalf,
  Battery,
  Filter,
  Search,
  Loader,
  ShoppingCart,
  Eye,
  Zap,
} from "lucide-react";

function PowerBanks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [capacityRange, setCapacityRange] = useState(null);
  const [warrantyRange, setWarrantyRange] = useState(null);
  const [ratingRange, setRatingRange] = useState(null);
  const [discountRange, setDiscountRange] = useState(null);

  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchPowerBanks = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/powerbanks");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching power banks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPowerBanks();
  }, []);

  // Get unique values for filters
  const uniqueBrands = [
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ];

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Helper function to safely get price value from different possible property names
  const getPrice = (product) => {
    // Try different possible property names that APIs commonly use
    const price =
      product.price ||
      product.originalPrice ||
      product.mrp ||
      product.cost ||
      product.amount ||
      0;
    return Number(price) || 0;
  };

  // Helper function to safely get discount value
  const getDiscount = (product) => {
    const discount =
      product.discount ||
      product.discountPercent ||
      product.discountPercentage ||
      product.offer ||
      0;
    return Number(discount) || 0;
  };

  // Calculate discounted price safely
  const getDiscountedPrice = (product) => {
    const priceNum = getPrice(product);
    const discountNum = getDiscount(product);
    if (priceNum === 0) return 0;
    if (discountNum === 0) return priceNum;
    return Math.round(priceNum - (priceNum * discountNum) / 100);
  };

  // Debug: Log the first product to see the actual API structure
  useEffect(() => {
    if (products.length > 0) {
      console.log("First product from API:", products[0]);
      console.log("Available properties:", Object.keys(products[0]));
    }
  }, [products]);

  const handleViewDetails = (productId) => {
    navigate(`/powerbank/${productId}`);
  };

  const filteredProducts = products.filter((product) => {
    if (!product) return false;

    // Brand filter
    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes(product.brand || "");

    // Price filter
    const discountedPrice = getDiscountedPrice(product);
    const matchesPrice =
      !priceRange ||
      (priceRange === "0-1000" && discountedPrice <= 1000) ||
      (priceRange === "1001-2000" &&
        discountedPrice > 1000 &&
        discountedPrice <= 2000) ||
      (priceRange === "2001-5000" &&
        discountedPrice > 2000 &&
        discountedPrice <= 5000) ||
      (priceRange === "5000above" && discountedPrice > 5000);

    // Capacity filter
    const capacity = Number(product.capacity) || 0;
    const matchesCapacity =
      !capacityRange ||
      (capacityRange === "0-10000" && capacity <= 10000) ||
      (capacityRange === "10001-20000" &&
        capacity > 10000 &&
        capacity <= 20000) ||
      (capacityRange === "20001-30000" &&
        capacity > 20000 &&
        capacity <= 30000) ||
      (capacityRange === "30000above" && capacity > 30000);

    // Warranty filter
    const warranty = parseInt(product.warranty) || 0;
    const matchesWarranty =
      !warrantyRange ||
      (warrantyRange === "0-6" && warranty <= 6) ||
      (warrantyRange === "7-12" && warranty > 6 && warranty <= 12) ||
      (warrantyRange === "13-24" && warranty > 12 && warranty <= 24) ||
      (warrantyRange === "24above" && warranty > 24);

    // Rating filter
    const rating = Number(product.rating) || 0;
    const matchesRating =
      !ratingRange ||
      (ratingRange === "1-2" && rating >= 1 && rating < 2) ||
      (ratingRange === "2-3" && rating >= 2 && rating < 3) ||
      (ratingRange === "3-4" && rating >= 3 && rating < 4) ||
      (ratingRange === "4-5" && rating >= 4 && rating <= 5);

    // Discount filter
    const discount = getDiscount(product);
    const matchesDiscount =
      !discountRange ||
      (discountRange === "0-10" && discount <= 10) ||
      (discountRange === "11-25" && discount > 10 && discount <= 25) ||
      (discountRange === "26-50" && discount > 25 && discount <= 50) ||
      (discountRange === "50above" && discount > 50);

    return (
      matchesBrand &&
      matchesPrice &&
      matchesCapacity &&
      matchesWarranty &&
      matchesRating &&
      matchesDiscount
    );
  });

  const FilterSection = ({ title, children }) => (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-header bg-gradient-primary text-white border-0">
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
    setCapacityRange(null);
    setWarrantyRange(null);
    setRatingRange(null);
    setDiscountRange(null);
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
                <h4 className="text-muted">Loading Power Banks...</h4>
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
          {/* Header Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle p-3 me-3">
                      <Battery className="text-white" size={32} />
                    </div>
                    <div>
                      <h1 className="mb-1 text-primary fw-bold">Power Banks</h1>
                      <p className="text-muted mb-0">
                        Portable power solutions for all your devices
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5 className="text-primary mb-0">
                      {filteredProducts.length}
                    </h5>
                    <small className="text-muted">Power Banks Available</small>
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
                  <h5 className="text-dark mb-0">
                    <Filter className="me-2" size={20} />
                    Filters
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                </div>

                {/* Brand Filter */}
                <FilterSection title="Brand">
                  <div className="max-height-200 overflow-auto">
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
                          className="form-check-label fw-medium text-dark"
                          htmlFor={`brand-${brand}`}
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Price Filter */}
                <FilterSection title="Price Range">
                  <div className="d-flex flex-column gap-2">
                    {[
                      { value: "0-1000", label: "Under ₹1,000" },
                      { value: "1001-2000", label: "₹1,001 - ₹2,000" },
                      { value: "2001-5000", label: "₹2,001 - ₹5,000" },
                      { value: "5000above", label: "Above ₹5,000" },
                    ].map((price) => (
                      <div className="form-check" key={price.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="priceRange"
                          checked={priceRange === price.value}
                          onChange={(e) => setPriceRange(e.target.value)}
                          value={price.value}
                          id={`price-${price.value}`}
                        />
                        <label
                          className="form-check-label fw-medium text-dark"
                          htmlFor={`price-${price.value}`}
                        >
                          {price.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Capacity Filter */}
                <FilterSection title="Capacity (mAh)">
                  <div className="d-flex flex-column gap-2">
                    {[
                      { value: "0-10000", label: "Under 10,000 mAh" },
                      { value: "10001-20000", label: "10,001 - 20,000 mAh" },
                      { value: "20001-30000", label: "20,001 - 30,000 mAh" },
                      { value: "30000above", label: "Above 30,000 mAh" },
                    ].map((capacity) => (
                      <div className="form-check" key={capacity.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="capacityRange"
                          checked={capacityRange === capacity.value}
                          onChange={(e) => setCapacityRange(e.target.value)}
                          value={capacity.value}
                          id={`capacity-${capacity.value}`}
                        />
                        <label
                          className="form-check-label fw-medium text-dark"
                          htmlFor={`capacity-${capacity.value}`}
                        >
                          {capacity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Warranty Filter */}
                <FilterSection title="Warranty (Months)">
                  <div className="d-flex flex-column gap-2">
                    {[
                      { value: "0-6", label: "0 - 6 months" },
                      { value: "7-12", label: "7 - 12 months" },
                      { value: "13-24", label: "13 - 24 months" },
                      { value: "24above", label: "Above 24 months" },
                    ].map((warranty) => (
                      <div className="form-check" key={warranty.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="warrantyRange"
                          checked={warrantyRange === warranty.value}
                          onChange={(e) => setWarrantyRange(e.target.value)}
                          value={warranty.value}
                          id={`warranty-${warranty.value}`}
                        />
                        <label
                          className="form-check-label fw-medium text-dark"
                          htmlFor={`warranty-${warranty.value}`}
                        >
                          {warranty.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Rating Filter */}
                <FilterSection title="Customer Rating">
                  <div className="d-flex flex-column gap-2">
                    {[
                      { value: "4-5", label: "4★ & above" },
                      { value: "3-4", label: "3★ & above" },
                      { value: "2-3", label: "2★ & above" },
                      { value: "1-2", label: "1★ & above" },
                    ].map((rating) => (
                      <div className="form-check" key={rating.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="ratingRange"
                          checked={ratingRange === rating.value}
                          onChange={(e) => setRatingRange(e.target.value)}
                          value={rating.value}
                          id={`rating-${rating.value}`}
                        />
                        <label
                          className="form-check-label fw-medium text-dark"
                          htmlFor={`rating-${rating.value}`}
                        >
                          {rating.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                {/* Discount Filter */}
                <FilterSection title="Discount">
                  <div className="d-flex flex-column gap-2">
                    {[
                      { value: "50above", label: "50% & above" },
                      { value: "26-50", label: "26% - 50%" },
                      { value: "11-25", label: "11% - 25%" },
                      { value: "0-10", label: "Up to 10%" },
                    ].map((discount) => (
                      <div className="form-check" key={discount.value}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="discountRange"
                          checked={discountRange === discount.value}
                          onChange={(e) => setDiscountRange(e.target.value)}
                          value={discount.value}
                          id={`discount-${discount.value}`}
                        />
                        <label
                          className="form-check-label fw-medium text-dark"
                          htmlFor={`discount-${discount.value}`}
                        >
                          {discount.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className="row g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="col-md-6 col-xl-4">
                      <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden hover-shadow-lg transition-all">
                        <div className="position-relative">
                          <img
                            src={product.image || "/placeholder-powerbank.jpg"}
                            className="card-img-top"
                            style={{
                              height: "240px",
                              objectFit: "contain",
                              padding: "20px",
                              background: "#f8f9fa",
                            }}
                            alt={product.name || "Power Bank"}
                            onError={(e) => {
                              e.target.src = "/placeholder-powerbank.jpg";
                            }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill shadow">
                              {getDiscount(product)}% OFF
                            </span>
                          </div>
                          <div className="position-absolute top-0 start-0 m-2">
                            <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill shadow">
                              <Zap size={12} className="me-1" />
                              {(product.capacity || 0).toLocaleString()} mAh
                            </span>
                          </div>
                        </div>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-2 fw-bold text-dark">
                            {product.name || "Power Bank"}
                          </h5>
                          <p className="text-primary fw-semibold mb-3">
                            {product.brand || "Unknown Brand"}
                          </p>

                          {product.rating && (
                            <div className="mb-3">
                              {renderRatingStars(product.rating)}
                            </div>
                          )}

                          <div className="d-flex align-items-center gap-3 mb-3">
                            {getDiscount(product) > 0 ? (
                              <>
                                <span className="text-decoration-line-through text-muted fs-6">
                                  ₹{getPrice(product).toLocaleString()}
                                </span>
                                <span className="fs-4 fw-bold text-success">
                                  ₹
                                  {getDiscountedPrice(product).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="fs-4 fw-bold text-success">
                                ₹{getPrice(product).toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="small text-muted mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Capacity:</span>
                              <span className="fw-medium text-dark">
                                {(product.capacity || 0).toLocaleString()} mAh
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Warranty:</span>
                              <span className="fw-medium text-dark">
                                {product.warranty || "N/A"} months
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Output Ports:</span>
                              <span className="fw-medium text-dark">
                                {product.outputPorts || "Multiple"}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Input Type:</span>
                              <span className="fw-medium text-dark">
                                {product.inputType || "USB-C"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-transparent border-0 p-4 pt-0">
                          <div className="d-grid gap-2">
                            <button
                              className="btn btn-outline-primary fw-semibold py-2"
                              onClick={() => handleViewDetails(product.id)}
                            >
                              <Eye size={16} className="me-2" />
                              View Details
                            </button>
                            <button className="btn btn-primary fw-semibold py-2">
                              <ShoppingCart size={16} className="me-2" />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <div className="bg-white rounded-3 shadow-sm p-5">
                        <Search className="text-muted mb-3" size={64} />
                        <h4 className="text-muted mb-2">
                          No power banks found
                        </h4>
                        <p className="text-muted mb-4">
                          No power banks match your current filter criteria.
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

export default PowerBanks;

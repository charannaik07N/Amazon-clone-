import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Search, Filter, Watch, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SmartWatches() {
  const [smartWatches, setSmartWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [dialShape, setDialShape] = useState(null);
  const [displaySize, setDisplaySize] = useState(null);
  const [displayType, setDisplayType] = useState(null);
  const [compatibleOS, setCompatibleOS] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchWatches = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/watch");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSmartWatches(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching watches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatches();
  }, []);

  // Get unique values for filters
  const uniqueBrands = [...new Set(smartWatches.map((watch) => watch.brand))];
  const uniqueDisplaySizes = [
    ...new Set(smartWatches.map((watch) => watch.displaySize)),
  ];
  const uniqueDisplayTypes = [
    ...new Set(smartWatches.map((watch) => watch.displayType)),
  ];
  const uniqueDialShapes = [
    ...new Set(smartWatches.map((watch) => watch.dialShape)),
  ];
  const uniqueOS = [
    ...new Set(smartWatches.map((watch) => watch.compatibleOS)),
  ];
  const uniqueFeatures = [
    ...new Set(smartWatches.map((watch) => watch.features).flat()),
  ];

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  const handlePriceChange = (range) => setPriceRange(range);
  const handleDiscountChange = (value) => setDiscount(value);
  const handleDialShapeChange = (shape) => setDialShape(shape);
  const handleDisplaySizeChange = (size) => setDisplaySize(size);
  const handleDisplayTypeChange = (type) => setDisplayType(type);
  const handleCompatibleOSChange = (os) => setCompatibleOS(os);
  const handleFeatureChange = (feature) => setSelectedFeature(feature);

  const filteredWatches = smartWatches.filter((watch) => {
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(watch.brand);
    const matchesPrice =
      priceRange === null ||
      (priceRange === "0-10000" && watch.price <= 10000) ||
      (priceRange === "10000-20000" &&
        watch.price > 10000 &&
        watch.price <= 20000) ||
      (priceRange === "20000-30000" &&
        watch.price > 20000 &&
        watch.price <= 30000) ||
      (priceRange === "above-30000" && watch.price > 30000);
    const matchesDiscount = discount === null || watch.discount >= discount;
    const matchesDialShape =
      dialShape === null || watch.dialShape === dialShape;
    const matchesDisplaySize =
      displaySize === null || watch.displaySize === displaySize;
    const matchesDisplayType =
      displayType === null || watch.displayType === displayType;
    const matchesCompatibleOS =
      compatibleOS === null || watch.compatibleOS === compatibleOS;
    const matchesFeature =
      selectedFeature === null || watch.features.includes(selectedFeature);

    return (
      matchesBrand &&
      matchesPrice &&
      matchesDiscount &&
      matchesDialShape &&
      matchesDisplaySize &&
      matchesDisplayType &&
      matchesCompatibleOS &&
      matchesFeature
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

  const handleViewDetails = (brand, id) => {
    navigate(`/product/${brand.toLowerCase()}/${id}`);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange(null);
    setDiscount(null);
    setDialShape(null);
    setDisplaySize(null);
    setDisplayType(null);
    setCompatibleOS(null);
    setSelectedFeature(null);
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
                <h4 className="text-muted">Loading Smart Watches...</h4>
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
                      <Watch className="text-white" size={32} />
                    </div>
                    <div>
                      <h1 className="mb-1 text-primary fw-bold">
                        Smart Watches
                      </h1>
                      <p className="text-muted mb-0">
                        Discover the perfect smartwatch for your lifestyle
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5 className="text-primary mb-0">
                      {filteredWatches.length}
                    </h5>
                    <small className="text-muted">Products Found</small>
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
                    { label: "₹0 - ₹10,000", value: "0-10000" },
                    { label: "₹10,000 - ₹20,000", value: "10000-20000" },
                    { label: "₹20,000 - ₹30,000", value: "20000-30000" },
                    { label: "Above ₹30,000", value: "above-30000" },
                  ].map((range) => (
                    <div className="form-check mb-2" key={range.value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="price"
                        checked={priceRange === range.value}
                        onChange={() => handlePriceChange(range.value)}
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

                <FilterSection title="Discount">
                  {[10, 15, 20].map((value) => (
                    <div className="form-check mb-2" key={value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="discount"
                        checked={discount === value}
                        onChange={() => handleDiscountChange(value)}
                        id={`discount-${value}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`discount-${value}`}
                      >
                        {value}% or more
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Dial Shape">
                  {uniqueDialShapes.map((shape) => (
                    <div className="form-check mb-2" key={shape}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dialShape"
                        checked={dialShape === shape}
                        onChange={() => handleDialShapeChange(shape)}
                        id={`shape-${shape}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`shape-${shape}`}
                      >
                        {shape}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Display Size">
                  {uniqueDisplaySizes.map((size) => (
                    <div className="form-check mb-2" key={size}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="displaySize"
                        checked={displaySize === size}
                        onChange={() => handleDisplaySizeChange(size)}
                        id={`size-${size}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`size-${size}`}
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Display Type">
                  {uniqueDisplayTypes.map((type) => (
                    <div className="form-check mb-2" key={type}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="displayType"
                        checked={displayType === type}
                        onChange={() => handleDisplayTypeChange(type)}
                        id={`display-${type}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`display-${type}`}
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Compatible OS">
                  {uniqueOS.map((os) => (
                    <div className="form-check mb-2" key={os}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="compatibleOS"
                        checked={compatibleOS === os}
                        onChange={() => handleCompatibleOSChange(os)}
                        id={`os-${os}`}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`os-${os}`}
                      >
                        {os}
                      </label>
                    </div>
                  ))}
                </FilterSection>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className="row g-4">
                {filteredWatches.length > 0 ? (
                  filteredWatches.map((watch) => (
                    <div key={watch.id} className="col-md-6 col-xl-4">
                      <div className="card h-100 shadow-sm border-0 position-relative overflow-hidden">
                        <div className="position-relative">
                          <img
                            src={watch.image}
                            className="card-img-top"
                            style={{
                              height: "220px",
                              objectFit: "contain",
                              padding: "15px",
                            }}
                            alt={watch.name}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-danger fs-6 px-3 py-2 rounded-pill">
                              {watch.discount}% OFF
                            </span>
                          </div>
                        </div>
                        <div className="card-body p-4">
                          <h5 className="card-title mb-2 fw-bold text-dark">
                            {watch.name}
                          </h5>
                          <p className="text-primary fw-semibold mb-3">
                            {watch.brand}
                          </p>

                          <div className="d-flex align-items-center gap-3 mb-3">
                            <span className="fs-4 fw-bold text-success">
                              ₹
                              {(
                                watch.price *
                                (1 - watch.discount / 100)
                              ).toFixed(0)}
                            </span>
                            <span className="text-decoration-line-through text-muted fs-6">
                              ₹{watch.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="small text-muted">
                            <div className="d-flex justify-content-between mb-1">
                              <span>Display:</span>
                              <span className="fw-medium">
                                {watch.displayType}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <span>Size:</span>
                              <span className="fw-medium">
                                {watch.displaySize}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <span>Shape:</span>
                              <span className="fw-medium">
                                {watch.dialShape}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>OS:</span>
                              <span className="fw-medium">
                                {watch.compatibleOS}
                              </span>
                            </div>
                          </div>

                          {watch.features && watch.features.length > 0 && (
                            <div className="mt-3">
                              <div className="d-flex flex-wrap gap-1">
                                {watch.features
                                  .slice(0, 2)
                                  .map((feature, index) => (
                                    <span
                                      key={index}
                                      className="badge bg-light text-dark small"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                {watch.features.length > 2 && (
                                  <span className="badge bg-light text-muted small">
                                    +{watch.features.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="card-footer bg-transparent border-0 p-4 pt-0">
                          <button
                            className="btn btn-primary w-100 fw-semibold py-2"
                            onClick={() =>
                              handleViewDetails(watch.brand, watch.id)
                            }
                          >
                            View Details
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
                        <h4 className="text-muted mb-2">No products found</h4>
                        <p className="text-muted mb-4">
                          No products match your current filter criteria.
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

export default SmartWatches;

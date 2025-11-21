import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import { Star, StarHalf, ChevronLeft, ChevronRight } from "lucide-react";

function Case() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [bodyType, setBodyType] = useState(null);
  const [wheels, setWheels] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);

  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/cases");
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
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleBodyTypeChange = (type) => {
    setBodyType(type);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleWheelsChange = (type) => {
    setWheels(type);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle view details click - navigate to case details with correct routing
  const handleViewDetails = (product) => {
    // Navigate to the case detail route with brand and product ID
    navigate(`/case/${product.brand}/${product.id}`, { state: product });
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
    const matchesBodyType = bodyType === null || product.bodyType === bodyType;
    const matchesWheels = wheels === null || product.wheels === wheels;
    return matchesBrand && matchesPrice && matchesBodyType && matchesWheels;
  });

  // Pagination logic
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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
      <div className="card-header bg-light">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );

  // Get all unique brands from products for the filter
  const uniqueBrands = [...new Set(products.map((product) => product.brand))];

  return (
    <>
      <Navbar />
      <div className="container-fluid bg-light py-4">
        <div className="container">
          <h1 className="mb-4 text-primary">Men's Bags</h1>

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading products...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <div className="row g-4">
              {/* Filters Column */}
              <div className="col-lg-3">
                <div className="sticky-top" style={{ top: "20px" }}>
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
                      { label: "₹1,000 - ₹1,500", value: "1000-1500" },
                      { label: "₹1,500 - ₹2,000", value: "1500-2000" },
                      { label: "Above ₹2,000", value: "2000above" },
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

                  <FilterSection title="Body Type">
                    {["Soft Body", "Hard Body"].map((type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="bodyType"
                          checked={bodyType === type}
                          onChange={() => handleBodyTypeChange(type)}
                          id={`body-${type}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`body-${type}`}
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </FilterSection>

                  <FilterSection title="Wheels">
                    {["Upright 2 wheels", "Spinner 4 wheels"].map((type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="wheels"
                          checked={wheels === type}
                          onChange={() => handleWheelsChange(type)}
                          id={`wheels-${type}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`wheels-${type}`}
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </FilterSection>

                  {/* Clear Filters Button */}
                  <div className="card shadow-sm">
                    <div className="card-body text-center">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setSelectedBrands([]);
                          setPriceRange(null);
                          setBodyType(null);
                          setWheels(null);
                          setCurrentPage(1);
                        }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="col-lg-9">
                {/* Results Summary */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <p className="mb-0 text-muted">
                      Showing {indexOfFirstProduct + 1}-
                      {Math.min(indexOfLastProduct, totalProducts)} of{" "}
                      {totalProducts} products
                    </p>
                  </div>
                  {totalPages > 1 && (
                    <div className="text-muted">
                      Page {currentPage} of {totalPages}
                    </div>
                  )}
                </div>

                <div className="row g-4">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <div key={product.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm hover-shadow transition-all">
                          <div className="position-relative">
                            <img
                              src={product.image}
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "contain" }}
                              alt={product.name}
                            />
                            <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                              {product.discount}% OFF
                            </span>
                          </div>
                          <div className="card-body">
                            <h5 className="card-title mb-1">{product.name}</h5>
                            <p className="text-muted small mb-2">
                              {product.brand}
                            </p>
                            <div className="mb-2">
                              {renderRatingStars(product.rating)}
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span className="text-decoration-line-through text-muted">
                                ₹{product.originalPrice}
                              </span>
                              <span className="fs-5 fw-bold text-primary">
                                ₹{product.discountedPrice}
                              </span>
                            </div>
                            <div className="small text-muted">
                              <div>
                                {product.bodyType} • {product.wheels}
                              </div>
                            </div>
                          </div>
                          <div className="card-footer bg-white border-top-0">
                            <button
                              onClick={() => handleViewDetails(product)}
                              className="btn btn-primary w-100"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <div className="alert alert-info text-center">
                        No products found matching your criteria.
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-5">
                    <nav aria-label="Product pagination">
                      <ul className="pagination pagination-lg">
                        {/* Previous Button */}
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous"
                          >
                            <ChevronLeft size={20} />
                          </button>
                        </li>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNumber, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              pageNumber === currentPage ? "active" : ""
                            } ${pageNumber === "..." ? "disabled" : ""}`}
                          >
                            {pageNumber === "..." ? (
                              <span className="page-link">...</span>
                            ) : (
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            )}
                          </li>
                        ))}

                        {/* Next Button */}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}

                {/* Quick Jump to Page */}
                {totalPages > 5 && (
                  <div className="d-flex justify-content-center mt-3">
                    <div className="input-group" style={{ maxWidth: "200px" }}>
                      <span className="input-group-text">Go to page</span>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                          const page = parseInt(e.target.value);
                          if (page >= 1 && page <= totalPages) {
                            handlePageChange(page);
                          }
                        }}
                      />
                    </div>
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

export default Case;

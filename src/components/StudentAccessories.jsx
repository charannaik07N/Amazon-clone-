import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Star, StarHalf } from "lucide-react";
import {
  useNavigate,
  Link,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function StudentAccessories() {
  // Initialize with empty array instead of undefined initialProducts
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products from server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/Student");
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
  const handleTypeChange = (type) => setSelectedType(type);

  // Get unique brands from products - only if products array is not empty
  const uniqueBrands =
    products.length > 0
      ? [...new Set(products.map((product) => product.brand))]
      : [];

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
    const matchesType = selectedType === null || product.type === selectedType;
    return matchesBrand && matchesPrice && matchesType;
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
  const uniqueTypes =
    products.length > 0
      ? [...new Set(products.map((product) => product.type))]
      : [];

  const FilterSection = ({ title, children }) => (
    <div className="card mb-3 shadow-sm">
      <div className="card-header bg-light">
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
          <h1 className="mb-4 text-primary">Student Accessories</h1>

          {/* Show loading state */}
          {loading && (
            <div className="alert alert-info text-center">
              Loading products, please wait...
            </div>
          )}

          {/* Show error message if any */}
          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {/* Main content when not loading and no errors */}
          {!loading && !error && (
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

                  <FilterSection title="Product Type">
                    {uniqueTypes.map((type) => (
                      <div className="form-check" key={type}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="productType"
                          checked={selectedType === type}
                          onChange={() => handleTypeChange(type)}
                          id={`type-${type}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`type-${type}`}
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
                    filteredProducts.map((product) => (
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
                              <div>{product.type}</div>
                            </div>
                          </div>
                          <div className="card-footer bg-white border-top-0">
                            <div className="d-grid gap-2">
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  // Create product object for cart
                                  const cartItem = {
                                    productId: `student_${product.id}`,
                                    name: product.name,
                                    price: product.discountedPrice,
                                    quantity: 1,
                                    image: product.image,
                                    category: "Student Accessories",
                                    brand: product.brand,
                                    type: product.type,
                                  };

                                  // Dispatch custom event for cart update
                                  const event = new CustomEvent("cartUpdate", {
                                    detail: {
                                      product: cartItem,
                                      action: "add",
                                    },
                                  });
                                  window.dispatchEvent(event);

                                  // Show success message
                                  alert(`Added ${product.name} to cart!`);
                                }}
                              >
                                <i className="bi bi-cart-plus me-2"></i>
                                Add to Cart
                              </button>
                              <Link
                                to={`/student/${product.brand}/${product.id}`}
                                state={product}
                                className="btn btn-outline-secondary"
                              >
                                View Details
                              </Link>
                            </div>
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
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentAccessories;

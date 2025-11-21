import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FiHeart,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";

const ProductShoe = () => {
  // Get product ID from URL parameters
  const { id } = useParams();

  const [allProducts, setAllProducts] = useState([]);
  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(
    id ? parseInt(id) : 1
  );

  // Fetch all product data from API
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/AllShoe");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAllProducts(data);

        // If we have an ID from the URL parameters, use that
        const productId = id ? parseInt(id) : 1;

        // Find the product with the matching ID
        const product = data.find((item) => item.id === productId.toString());

        if (!product) {
          throw new Error(`Product with ID ${productId} not found!`);
        }

        setProductData(product);
        setCurrentProductId(productId);
        setImageLoaded(false);
        setActiveImage(0);

        // Set initial selected color from the product data if it exists
        if (product.colors && product.colors.length > 0) {
          setSelectedColor(product.colors[0].id);
        }

        // Set initial selected size from the product data if it exists
        if (product.sizes && product.sizes.length > 0) {
          setSelectedSize(product.sizes[0].size);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [id]);

  // Navigate to previous/next product
  const navigateToProduct = (direction) => {
    if (!allProducts || allProducts.length <= 1) return;

    const currentIndex = allProducts.findIndex(
      (p) => p.id === currentProductId.toString()
    );
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % allProducts.length;
    } else {
      newIndex = (currentIndex - 1 + allProducts.length) % allProducts.length;
    }

    // Update URL to reflect the new product
    window.history.pushState(
      {},
      "",
      `/product/${allProducts[newIndex].name.toLowerCase()}/${
        allProducts[newIndex].id
      }`
    );

    setCurrentProductId(parseInt(allProducts[newIndex].id));
    setProductData(allProducts[newIndex]);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  // Get current price based on selected size
  const getCurrentPrice = () => {
    if (!productData || !productData.sizes || !selectedSize) return null;

    const size = productData.sizes.find((s) => s.size === selectedSize);
    return size ? size.price : null;
  };

  // Update document title when product data changes
  useEffect(() => {
    if (productData) {
      document.title = `${productData.name} - ${productData.description}`;
    }
  }, [productData]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalf key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }
    return stars;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show error message if fetch failed
  if (error || !productData) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Product</h4>
            <p>
              {error || "Failed to load product data. Please try again later."}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Get current price based on selected size
  const currentPrice = getCurrentPrice();

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {/* Navigation buttons */}
        {allProducts.length > 1 && (
          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => navigateToProduct("prev")}
            >
              <FiArrowLeft /> Previous Product
            </button>
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => navigateToProduct("next")}
            >
              Next Product <FiArrowRight />
            </button>
          </div>
        )}

        <div className="row g-5">
          <div className="col-lg-6">
            <div className="position-relative mb-4">
              <div className="ratio ratio-1x1">
                {!imageLoaded && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <img
                  src={
                    productData.images && productData.images.length > 0
                      ? productData.images[activeImage]
                      : "/api/placeholder/400/400"
                  }
                  alt={`${productData.name} view ${activeImage + 1}`}
                  className={`rounded-3 shadow-lg ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    objectFit: "contain",
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onLoad={handleImageLoad}
                />
              </div>
            </div>
            {/* Thumbnail Gallery */}
            <div className="d-flex gap-2 justify-content-center">
              {productData.images && productData.images.length > 0 ? (
                productData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`ratio ratio-1x1 ${
                      activeImage === idx
                        ? "border border-3 border-primary shadow-lg"
                        : "border hover:border-primary"
                    } rounded-3 overflow-hidden`}
                    style={{
                      width: "70px",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img
                      src={img}
                      alt={`${productData.name} thumbnail ${idx + 1}`}
                      className="img-fluid"
                      style={{
                        objectFit: "contain",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    />
                  </div>
                ))
              ) : (
                <div className="text-center p-2">
                  No additional images available
                </div>
              )}
            </div>
          </div>
          {/* Right Column - Product Details */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h1 className="display-5 fw-bold mb-2">{productData.name}</h1>
              <h2 className="h3 mb-3">{productData.description}</h2>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex gap-1">
                  {renderStars(productData.rating)}
                </div>
                <span className="text-muted small">
                  ({productData.rating} rating)
                </span>
              </div>
              {currentPrice && (
                <div className="d-flex align-items-baseline gap-2">
                  <h2 className="display-6 fw-bold text-primary mb-0">
                    ₹{currentPrice.toLocaleString()}
                  </h2>
                </div>
              )}
            </div>

            <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">Quantity</label>
                    <div className="input-group input-group-lg shadow-sm">
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() =>
                          quantity > 1 && setQuantity(quantity - 1)
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max="10"
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() =>
                          quantity < 10 && setQuantity(quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="form-label fw-semibold mb-3">Color</label>
                  <div className="d-flex gap-3">
                    {productData.colors && productData.colors.length > 0 ? (
                      productData.colors.map((color) => (
                        <button
                          key={color.id}
                          className={`rounded-circle border-3 ${
                            selectedColor === color.id
                              ? "border-primary shadow-lg"
                              : "border-secondary"
                          }`}
                          style={{
                            backgroundColor: color.value,
                            width: "48px",
                            height: "48px",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                          }}
                          onClick={() => setSelectedColor(color.id)}
                          title={color.name}
                        />
                      ))
                    ) : (
                      <div>No color options available</div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="form-label fw-semibold mb-3">Size</label>
                  <div className="d-flex flex-wrap gap-2">
                    {productData.sizes && productData.sizes.length > 0 ? (
                      productData.sizes.map((sizeOption) => (
                        <button
                          key={sizeOption.size}
                          className={`btn ${
                            selectedSize === sizeOption.size
                              ? "btn-primary shadow"
                              : "btn-outline-primary"
                          }`}
                          style={{
                            minWidth: "60px",
                            transition: "all 0.2s ease-in-out",
                          }}
                          onClick={() => setSelectedSize(sizeOption.size)}
                        >
                          {sizeOption.size}
                        </button>
                      ))
                    ) : (
                      <div>No size options available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3">
              <button className="btn btn-primary btn-lg flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
                <FiShoppingBag className="fs-5" /> Add to bag
              </button>
              <button className="btn btn-outline-primary btn-lg px-4 shadow-sm hover:shadow transition-shadow">
                <FiHeart className="fs-5" />
              </button>
            </div>

            {/* Product selection dropdown for mobile view */}
            {allProducts.length > 1 && (
              <div className="mt-4 d-md-none">
                <label className="form-label fw-semibold">
                  Browse Other Products
                </label>
                <select
                  className="form-select form-select-lg"
                  value={currentProductId}
                  onChange={(e) => {
                    const newId = parseInt(e.target.value);
                    setCurrentProductId(newId);

                    // Find and set the selected product
                    const selectedProduct = allProducts.find(
                      (p) => p.id === newId.toString()
                    );
                    if (selectedProduct) {
                      setProductData(selectedProduct);

                      // Update URL to reflect the product change
                      window.history.pushState(
                        {},
                        "",
                        `/product/${selectedProduct.name.toLowerCase()}/${
                          selectedProduct.id
                        }`
                      );
                    }
                  }}
                >
                  {allProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.description}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductShoe;

import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Keyboard = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedConnectivity, setSelectedConnectivity] = useState("Wireless");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 12,
    brand: "Asus",
    originalPrice: 1000,
    discountedPrice: 800,
    rating: 5,
    discount: 20,
    name: "Keyboard Mouse Combo",
    image: "./image/key.webp",
    type: "Keyboard Mouse Combo",
  };
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/key.webp", // Main image
      "/image/Student/key1 (1).jpg",
      "/image/Student/key1 (2).jpg",
      "/image/Student/key1 (3).jpg",
    //   "/image/Student/keyboard4.jpg",
    ];
  };

  const images = getProductImages();

  const connectivityOptions = [
    { id: "Wireless", name: "Wireless (2.4GHz)" },
    { id: "Bluetooth", name: "Bluetooth 5.0" },
    { id: "Wired", name: "Wired USB" },
  ];

  const colorOptions = [
    { color: "Black", price: 800 },
    { color: "White", price: 850 },
    { color: "RGB", price: 1000 },
    { color: "Gaming Edition", price: 1200 },
  ];

  const getCurrentPrice = () => {
    if (!selectedColor) return 0;
    const colorOption = colorOptions.find((c) => c.color === selectedColor);
    return colorOption ? colorOption.price * quantity : 0;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

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

  useEffect(() => {
    if (product) {
      document.title = `${product.brand} - ${product.name}`;
    }
  }, [product]);

  if (!product) {
    return <div className="container my-5">Product not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row g-5">
          {/* Left Column - Images */}
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
                {/* Main Image */}
                <img
                  src={images[activeImage]}
                  alt={`${product.name} view ${activeImage + 1}`}
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

            {/* Thumbnail Images */}
            <div className="d-flex justify-content-center gap-2 mt-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail rounded-3 ${
                    activeImage === index ? "border-primary" : ""
                  }`}
                  style={{ width: "80px", height: "80px", cursor: "pointer" }}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h1 className="display-5 fw-bold mb-2">
                {product.brand} - {product.name}
              </h1>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-muted small">
                  ({product.rating} rating)
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <h2 className="display-6 fw-bold text-primary mb-0">
                  {selectedColor
                    ? `₹${getCurrentPrice().toLocaleString()}`
                    : "Select color for price"}
                </h2>
                {selectedColor && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(getCurrentPrice() * 1.25).toLocaleString()}
                  </p>
                )}
                {selectedColor && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <p className="lead mb-4">
              {product.type} by {product.brand} - Ergonomic design for
              comfortable typing and precise cursor control
            </p>

            {/* Connectivity selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Select Connectivity:
              </label>
              <div className="d-flex flex-wrap gap-2">
                {connectivityOptions.map((connectivity) => (
                  <div
                    key={connectivity.id}
                    onClick={() => setSelectedConnectivity(connectivity.id)}
                    className={`border rounded-3 p-2 ${
                      selectedConnectivity === connectivity.id
                        ? "border-primary bg-primary bg-opacity-10"
                        : ""
                    }`}
                    style={{ cursor: "pointer", minWidth: "150px" }}
                  >
                    <div className="text-center">{connectivity.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Select Color Variant:
                </label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">Select Color</option>
                  {colorOptions.map((colorOption) => (
                    <option key={colorOption.color} value={colorOption.color}>
                      {colorOption.color} - ₹{colorOption.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Quantity:</label>
                <input
                  type="number"
                  className="form-control form-control-lg shadow-sm"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
            </div>

            {/* Specifications card */}
            <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold">Specifications:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Brand:</strong> Asus
                      </li>
                      <li className="mb-2">
                        <strong>Keyboard Type:</strong> Membrane
                      </li>
                      <li className="mb-2">
                        <strong>Mouse DPI:</strong> Up to 1600 DPI
                      </li>
                      <li className="mb-2">
                        <strong>Battery Life:</strong> Up to 12 months
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Key Layout:</strong> Multimedia
                      </li>
                      <li className="mb-2">
                        <strong>Mouse Buttons:</strong> 5 programmable
                      </li>
                      <li className="mb-2">
                        <strong>Connectivity:</strong> {selectedConnectivity}
                      </li>
                      <li className="mb-2">
                        <strong>Warranty:</strong> 2 Years
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Full-sized ergonomic keyboard with multimedia hotkeys for
                    easy access to common functions.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Precise optical mouse with adjustable DPI settings for
                    versatile sensitivity options.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Long battery life with power-saving technology and low
                    battery indicator.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Plug-and-play setup with no additional software required
                    for basic functionality.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Spill-resistant design and durable construction for
                    everyday use.
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-3 mt-3">
              <button className="btn btn-primary btn-lg shadow-sm px-4 d-flex align-items-center gap-2">
                <FiShoppingBag />
                Add to Cart
              </button>
              <button className="btn btn-outline-secondary btn-lg shadow-sm px-4 d-flex align-items-center gap-2">
                <FiHeart />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Keyboard;

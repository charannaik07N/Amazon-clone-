import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Pens = () => {
  const [selectedColor, setSelectedColor] = useState("blue");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 2,
    brand: "Hauser",
    originalPrice: 500,
    discountedPrice: 359,
    rating: 5,
    discount: 28,
    name: "Pens",
    image: "./image/pen1.webp",
    type: "Pens",
  };
  const { id } = useParams(); 

  const getProductImages = () => {
    return [
      "/image/pen1.webp", // Main image
      "/image/Student/pen1 (1).jpg",
      "/image/Student/pen1 (2).jpg",
      "/image/Student/pen1 (3).jpg",
    //   "/image/pen5.jpg",
    ];
  };

  const images = getProductImages();

  const colors = [
    { id: "blue", value: "#0000FF", name: "Royal Blue" },
    { id: "black", value: "#000000", name: "Classic Black" },
    { id: "red", value: "#FF0000", name: "Vibrant Red" },
  ];

  const penTypes = [
    { type: "Ballpoint Pen", price: 359 },
    { type: "Gel Pen", price: 399 },
    { type: "Fountain Pen", price: 599 },
  ];

  const getCurrentPrice = () => {
    if (!selectedType) return 0;
    const typeOption = penTypes.find((t) => t.type === selectedType);
    return typeOption ? typeOption.price * quantity : 0;
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
                  {selectedType
                    ? `₹${getCurrentPrice().toLocaleString()}`
                    : "Select pen type for price"}
                </h2>
                {selectedType && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(product.originalPrice * quantity).toLocaleString()}
                  </p>
                )}
                {selectedType && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <p className="lead mb-4">
              {product.type} by {product.brand} - Premium writing instruments
              for every occasion
            </p>

            {/* Color selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Color:</label>
              <div className="d-flex gap-2">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`border rounded-circle p-1 ${
                      selectedColor === color.id
                        ? "border-primary border-2"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        backgroundColor: color.value,
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border:
                          color.id === "white" ? "1px solid #ddd" : "none",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <p className="small mt-1">
                Selected: {colors.find((c) => c.id === selectedColor)?.name}
              </p>
            </div>

            {/* Pen type selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Select Pen Type:
                </label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  {penTypes.map((typeOption) => (
                    <option key={typeOption.type} value={typeOption.type}>
                      {typeOption.type}
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
                        <strong>Brand:</strong> Hauser
                      </li>
                      <li className="mb-2">
                        <strong>Model:</strong> Signature Series
                      </li>
                      <li className="mb-2">
                        <strong>Ink Type:</strong> Quick-dry
                      </li>
                      <li className="mb-2">
                        <strong>Tip Size:</strong> 0.7mm
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Refillable:</strong> Yes
                      </li>
                      <li className="mb-2">
                        <strong>Material:</strong> Metal and Resin
                      </li>
                      <li className="mb-2">
                        <strong>Grip:</strong> Ergonomic
                      </li>
                      <li className="mb-2">
                        <strong>Pack Size:</strong> 3 pens
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Premium quality writing instruments for smooth, effortless
                    writing.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Ergonomic design reduces hand fatigue during extended
                    writing sessions.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Quick-drying ink prevents smudging and bleeding through
                    paper.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Durable metal construction ensures long-lasting
                    performance.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Elegant, professional appearance suitable for business or
                    academic use.
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

export default Pens;

import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const PencilKit = () => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedHardness, setSelectedHardness] = useState("HB");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 10,
    brand: "Apsara",
    originalPrice: 1500,
    discountedPrice: 1200,
    rating: 4,
    discount: 20,
    name: "Pencil",
    image: "./image/pencile.webp",
    type: "Pencil Kit",
  };
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/pencile.webp", // Main image
      "/image/Student/pencile (1).jpg",
      "/image/Student/pencile (2).jpg",
      "/image/Student/pencile (3).jpg",
    //   "/image/Student/pencil4.jpg",
    ];
  };

  const images = getProductImages();

  const hardnessGrades = [
    { id: "HB", name: "HB - Medium" },
    { id: "2B", name: "2B - Soft" },
    { id: "2H", name: "2H - Hard" },
    { id: "4B", name: "4B - Extra Soft" },
  ];

  const packages = [
    { package: "Starter Pack (5 pencils)", price: 500 },
    { package: "Standard Pack (10 pencils)", price: 1200 },
    { package: "Premium Pack (20 pencils)", price: 2000 },
    { package: "Artist Kit (15 pencils + tools)", price: 2500 },
  ];

  const getCurrentPrice = () => {
    if (!selectedPackage) return 0;
    const packageOption = packages.find((p) => p.package === selectedPackage);
    return packageOption ? packageOption.price * quantity : 0;
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
                {product.brand} - {product.name} {product.type}
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
                  {selectedPackage
                    ? `₹${getCurrentPrice().toLocaleString()}`
                    : "Select package for price"}
                </h2>
                {selectedPackage && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(product.originalPrice * quantity).toLocaleString()}
                  </p>
                )}
                {selectedPackage && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <p className="lead mb-4">
              Premium quality {product.type} by {product.brand} - Perfect for
              students, artists, and professionals
            </p>

            {/* Hardness selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Select Hardness Grade:
              </label>
              <div className="d-flex flex-wrap gap-2">
                {hardnessGrades.map((grade) => (
                  <div
                    key={grade.id}
                    onClick={() => setSelectedHardness(grade.id)}
                    className={`border rounded-3 p-2 ${
                      selectedHardness === grade.id
                        ? "border-primary bg-primary bg-opacity-10"
                        : ""
                    }`}
                    style={{ cursor: "pointer", minWidth: "120px" }}
                  >
                    <div className="text-center">{grade.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Select Package:
                </label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                >
                  <option value="">Select Package</option>
                  {packages.map((packageOption) => (
                    <option
                      key={packageOption.package}
                      value={packageOption.package}
                    >
                      {packageOption.package} - ₹{packageOption.price}
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
                        <strong>Brand:</strong> Apsara
                      </li>
                      <li className="mb-2">
                        <strong>Material:</strong> High-grade graphite
                      </li>
                      <li className="mb-2">
                        <strong>Wood Type:</strong> Cedar wood
                      </li>
                      <li className="mb-2">
                        <strong>Lead Size:</strong> 2mm
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Eraser:</strong> Non-dust eraser included
                      </li>
                      <li className="mb-2">
                        <strong>Length:</strong> 175mm
                      </li>
                      <li className="mb-2">
                        <strong>Shape:</strong> Hexagonal
                      </li>
                      <li className="mb-2">
                        <strong>Finish:</strong> Smooth lacquer coating
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Premium quality graphite for smooth writing and drawing
                    experience.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Break-resistant lead formula for durability and
                    long-lasting performance.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Environmentally friendly materials with sustainable wood
                    sourcing.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Ergonomic hexagonal design for comfortable grip during
                    extended use.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Ideal for students, artists, architects, and
                    professionals.
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

export default PencilKit;

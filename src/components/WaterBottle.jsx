import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const waterBottles = [
  {
    id: 1,
    brand: "MILTON",
    rating: 4.5,
    material: "Steel",
    capacity: "0.5-1L",
    packOf: 1,
    type: "Bottle",
    price: 299,
    discount: 10,
    name: "MILTON Steel Bottle",
    image: "./image/water1.jpg",
  },
  {
    id: 2,
    brand: "Cello",
    rating: 4.2,
    material: "Plastic",
    capacity: "<0.5L",
    packOf: 2,
    type: "Sipper",
    price: 149,
    discount: 15,
    name: "Cello Plastic Sipper",
    image: "./image/water2.jpg",
  },
  {
    id: 3,
    brand: "Hydroflask",
    rating: 4.8,
    material: "Copper",
    capacity: "801-1000ml",
    packOf: 1,
    type: "Flask",
    price: 799,
    discount: 20,
    name: "Hydroflask Copper Flask",
    image: "./image/water3.jpg",
  },
  {
    id: 4,
    brand: "Yeti",
    rating: 4.7,
    material: "Glass",
    capacity: "0.5-1L",
    packOf: 3,
    type: "Spray Bottle",
    price: 1199,
    discount: 25,
    name: "Yeti Glass Spray Bottle",
    image: "./image/water4.jpg",
  },
  {
    id: 5,
    brand: "Contigo",
    rating: 4.3,
    material: "Aluminium",
    capacity: "0.5-1L",
    packOf: 1,
    type: "Bottle",
    price: 449,
    discount: 30,
    name: "Contigo Aluminium Bottle",
    image: "./image/water5.jpg",
  },
  {
    id: 6,
    brand: "Nalgene",
    rating: 4.6,
    material: "Plastic",
    capacity: "0.5-1L",
    packOf: 2,
    type: "Bottle",
    price: 199,
    discount: 12,
    name: "Nalgene Plastic Bottle",
    image: "./image/water6.jpg",
  },
  {
    id: 6,
    brand: "MILTON",
    rating: 4.4,
    material: "Clay",
    capacity: "0.5-1L",
    packOf: 1,
    type: "Bottle",
    price: 349,
    discount: 12,
    name: "MILTON Clay Bottle",
    image: "./image/water6.jpg",
  },
  {
    id: 7,
    brand: "Cello",
    rating: 4.1,
    material: "Steel",
    capacity: "1L",
    packOf: 2,
    type: "Sipper",
    price: 399,
    discount: 15,
    name: "Cello Steel Sipper",
    image: "./image/water7.jpg",
  },
  {
    id: 8,
    brand: "Hydroflask",
    rating: 4.9,
    material: "Glass",
    capacity: "801-1000ml",
    packOf: 1,
    type: "Flask",
    price: 899,
    discount: 18,
    name: "Hydroflask Glass Flask",
    image: "./image/water8.jpg",
  },
  {
    id: 9,
    brand: "Yeti",
    rating: 4.6,
    material: "Copper",
    capacity: "1L",
    packOf: 3,
    type: "Spray Bottle",
    price: 1299,
    discount: 20,
    name: "Yeti Copper Spray Bottle",
    image: "./image/water9.jpg",
  },
  {
    id: 10,
    brand: "Contigo",
    rating: 4.2,
    material: "Plastic",
    capacity: "<0.5L",
    packOf: 1,
    type: "Bottle",
    price: 199,
    discount: 25,
    name: "Contigo Plastic Bottle",
    image: "./image/water10.jpg",
  },
  {
    id: 11,
    brand: "MILTON",
    rating: 4.3,
    material: "Aluminium",
    capacity: "0.5-1L",
    packOf: 1,
    type: "Bottle",
    price: 349,
    discount: 10,
    name: "MILTON Aluminium Bottle",
    image: "./image/water11.jpg",
  },
];

function WaterBottle() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [selectedCapacity, setSelectedCapacity] = useState(null);
  const [selectedPackOf, setSelectedPackOf] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  
  // Add state for cart operations
  const [addingToCart, setAddingToCart] = useState(null); // Store product ID being added
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial((prevSelected) =>
      prevSelected.includes(material)
        ? prevSelected.filter((m) => m !== material)
        : [...prevSelected, material]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedMaterial([]);
    setSelectedCapacity(null);
    setSelectedPackOf(null);
    setSelectedType(null);
    setPriceRange(null);
    setDiscount(null);
  };
  
  // Add to cart functionality
  const handleAddToCart = async (bottle) => {
    if (addingToCart) return; // Prevent multiple simultaneous adds
    
    try {
      setAddingToCart(bottle.id);
      
      // Calculate discounted price
      const discountedPrice = calculateDiscountedPrice(bottle.price, bottle.discount);
      
      // Prepare cart item data
      const cartItem = {
        productId: `bottle_${bottle.id}`,
        name: bottle.name,
        price: discountedPrice,
        quantity: 1,
        image: bottle.image,
        color: bottle.material || '',
        size: bottle.capacity || '',
        category: 'Water Bottles',
        brand: bottle.brand,
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

      const data = await response.json();
      
      // Show success message
      setCartMessage({
        show: true,
        text: `Added ${bottle.name} to your cart!`,
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
      setAddingToCart(null);
    }
  };

  const filteredWaterBottles = waterBottles.filter((bottle) => {
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(bottle.brand);
    const matchesMaterial =
      selectedMaterial.length === 0 ||
      selectedMaterial.includes(bottle.material);
    const matchesCapacity =
      selectedCapacity === null || bottle.capacity === selectedCapacity;
    const matchesPackOf =
      selectedPackOf === null || bottle.packOf === selectedPackOf;
    const matchesType = selectedType === null || bottle.type === selectedType;
    const matchesPrice =
      priceRange === null ||
      (priceRange === "0-200" && bottle.price <= 200) ||
      (priceRange === "201-500" && bottle.price > 200 && bottle.price <= 500) ||
      (priceRange === "501-1000" &&
        bottle.price > 500 &&
        bottle.price <= 1000) ||
      (priceRange === "1001-above" && bottle.price > 1000);
    const matchesDiscount = discount === null || bottle.discount >= discount;

    return (
      matchesBrand &&
      matchesMaterial &&
      matchesCapacity &&
      matchesPackOf &&
      matchesType &&
      matchesPrice &&
      matchesDiscount
    );
  });

  const sortedBottles = [...filteredWaterBottles].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "discount":
        return b.discount - a.discount;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="d-flex align-items-center">
        {"★".repeat(fullStars)}
        {hasHalfStar && "½"}
        {"☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </div>
    );
  };

  const calculateOriginalPrice = (price, discount) => {
    return Math.round(price / (1 - discount / 100));
  };
  
  const calculateDiscountedPrice = (price, discount) => {
    return Math.round(price * (1 - discount / 100));
  };

  return (
    <>
      <Navbar />
      <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <div className="bg-white shadow-sm border-bottom">
          <div className="container py-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 mb-0 text-primary fw-bold">
                  💧 Premium Water Bottles
                </h1>
                <p className="text-muted mb-0">
                  Stay hydrated with our quality collection
                </p>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-md-end align-items-center gap-3">
                  <div className="d-flex align-items-center">
                    <label className="form-label me-2 mb-0 fw-semibold">
                      Sort by:
                    </label>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "auto" }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating</option>
                      <option value="discount">Discount</option>
                    </select>
                  </div>
                  <span className="badge bg-primary fs-6">
                    {sortedBottles.length} Products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-4">
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
          
          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3 col-md-4 mb-4">
              <div className="bg-white rounded-3 shadow-sm border">
                <div className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0 fw-bold text-dark">🔍 Filters</h5>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Brand Filter */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-secondary mb-3">Brand</h6>
                    <div className="filter-group">
                      {[
                        "MILTON",
                        "Cello",
                        "Hydroflask",
                        "Yeti",
                        "Contigo",
                        "Nalgene",
                      ].map((brand) => (
                        <div className="form-check mb-2" key={brand}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`brand-${brand}`}
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material Filter */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-secondary mb-3">
                      Material
                    </h6>
                    <div className="filter-group">
                      {[
                        "Steel",
                        "Plastic",
                        "Copper",
                        "Glass",
                        "Aluminium",
                        "Clay",
                      ].map((material) => (
                        <div className="form-check mb-2" key={material}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`material-${material}`}
                            checked={selectedMaterial.includes(material)}
                            onChange={() => handleMaterialChange(material)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`material-${material}`}
                          >
                            {material}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capacity Filter */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-secondary mb-3">
                      Capacity
                    </h6>
                    <div className="filter-group">
                      {["<0.5L", "0.5-1L", "801-1000ml", "1L"].map(
                        (capacity) => (
                          <div className="form-check mb-2" key={capacity}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="capacity"
                              id={`capacity-${capacity}`}
                              checked={selectedCapacity === capacity}
                              onChange={() => setSelectedCapacity(capacity)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`capacity-${capacity}`}
                            >
                              {capacity}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-secondary mb-3">
                      Price Range
                    </h6>
                    <div className="filter-group">
                      {["0-200", "201-500", "501-1000", "1001-above"].map(
                        (range) => (
                          <div className="form-check mb-2" key={range}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="price"
                              id={`price-${range}`}
                              checked={priceRange === range}
                              onChange={() => setPriceRange(range)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`price-${range}`}
                            >
                              ₹
                              {range.replace("-", " - ₹").replace("above", "+")}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div className="mb-4">
                    <h6 className="fw-semibold text-secondary mb-3">Type</h6>
                    <div className="filter-group">
                      {["Bottle", "Sipper", "Flask", "Spray Bottle"].map(
                        (type) => (
                          <div className="form-check mb-2" key={type}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="type"
                              id={`type-${type}`}
                              checked={selectedType === type}
                              onChange={() => setSelectedType(type)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`type-${type}`}
                            >
                              {type}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="col-lg-9 col-md-8">
              {sortedBottles.length > 0 ? (
                <div className="row g-4">
                  {sortedBottles.map((bottle) => (
                    <div
                      key={bottle.id}
                      className="col-xl-4 col-lg-6 col-md-12"
                    >
                      <div className="card h-100 border-0 shadow-sm position-relative overflow-hidden">
                        {/* Discount Badge */}
                        {bottle.discount > 0 && (
                          <div className="position-absolute top-0 start-0 z-3">
                            <span className="badge bg-danger fs-6 rounded-0 rounded-end">
                              -{bottle.discount}% OFF
                            </span>
                          </div>
                        )}

                        {/* Product Image */}
                        <div className="position-relative overflow-hidden">
                          <img
                            src={bottle.image}
                            className="card-img-top"
                            alt={bottle.name}
                            style={{
                              height: "240px",
                              objectFit: "contain",
                              transition: "transform 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.transform = "scale(1.05)")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.transform = "scale(1)")
                            }
                          />
                          <div className="position-absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/20 to-transparent p-3">
                            <span className="badge bg-white text-dark">
                              {bottle.type}
                            </span>
                          </div>
                        </div>

                        <div className="card-body p-4">
                          {/* Brand & Rating */}
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-light text-dark border fw-normal">
                              {bottle.brand}
                            </span>
                            <div className="d-flex align-items-center">
                              <div
                                className="text-warning me-1"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {renderStars(bottle.rating)}
                              </div>
                              <small className="text-muted">
                                ({bottle.rating})
                              </small>
                            </div>
                          </div>

                          {/* Product Name */}
                          <h5
                            className="card-title mb-3 fw-semibold"
                            style={{ fontSize: "1.1rem" }}
                          >
                            {bottle.name}
                          </h5>

                          {/* Product Details */}
                          <div className="row g-2 mb-3 small text-muted">
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-1">🏷️</span>
                                <span>{bottle.material}</span>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-1">💧</span>
                                <span>{bottle.capacity}</span>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-1">📦</span>
                                <span>Pack of {bottle.packOf}</span>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <span className="me-1">⭐</span>
                                <span>{bottle.rating}/5</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Add to Cart */}
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <div>
                              <div className="d-flex align-items-baseline">
                                <h4 className="text-success mb-0 fw-bold">
                                  ₹{bottle.price}
                                </h4>
                                {bottle.discount > 0 && (
                                  <small className="text-muted text-decoration-line-through ms-2">
                                    ₹
                                    {calculateOriginalPrice(
                                      bottle.price,
                                      bottle.discount
                                    )}
                                  </small>
                                )}
                              </div>
                              {bottle.discount > 0 && (
                                <small className="text-success">
                                  Save ₹
                                  {calculateOriginalPrice(
                                    bottle.price,
                                    bottle.discount
                                  ) - bottle.price}
                                </small>
                              )}
                            </div>
                            <button 
                              className="btn btn-primary btn-sm px-3 fw-semibold"
                              onClick={() => handleAddToCart(bottle)}
                              disabled={addingToCart === bottle.id}
                            >
                              {addingToCart === bottle.id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                  Adding...
                                </>
                              ) : (
                                "Add to Cart"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="bg-white rounded-3 shadow-sm p-5">
                    <div className="mb-4">
                      <i
                        className="bi bi-search"
                        style={{ fontSize: "3rem", color: "#dee2e6" }}
                      ></i>
                    </div>
                    <h4 className="text-muted mb-3">No Water Bottles Found</h4>
                    <p className="text-muted mb-4">
                      We couldn't find any products matching your current
                      filters.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={clearAllFilters}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default WaterBottle;
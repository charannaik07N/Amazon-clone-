import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const SearchResults = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get('query') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableEndpoints, setAvailableEndpoints] = useState([]);

  // API endpoints with validation
  const apiEndpoints = [
    { endpoint: "AllShoe", category: "Shoes" },
    { endpoint: "CaseDetails", category: "Cases" },
    { endpoint: "cases", category: "Cases" },
    { endpoint: "cool", category: "Cooling" },
    { endpoint: "coolAll", category: "Cooling" },
    { endpoint: "cycle", category: "Cycles" },
    { endpoint: "Earbuds", category: "Earbuds" },
    { endpoint: "Earbudsdetails", category: "Earbuds" },
    { endpoint: "Headset", category: "Headsets" },
    { endpoint: "headsetAll", category: "Headsets" },
    { endpoint: "jacket", category: "Jackets" },
    { endpoint: "jacketdetails", category: "Jackets" },
    { endpoint: "lightdetails", category: "Lights" },
    { endpoint: "lights", category: "Lights" },
    { endpoint: "MonitorDetails", category: "Monitors" },
    { endpoint: "Monitors", category: "Monitors" },
    { endpoint: "power", category: "Power Banks" },
    { endpoint: "powerbanks", category: "Power Banks" },
    { endpoint: "Shoes", category: "Shoes" },
    { endpoint: "Student", category: "Student Items" },
    { endpoint: "table", category: "Tables" },
    { endpoint: "tablestands", category: "Table Stands" },
    { endpoint: "Tshirt", category: "T-Shirts" },
    { endpoint: "TshirtAll", category: "T-Shirts" },
    { endpoint: "watch", category: "Watches" },
    { endpoint: "watchAll", category: "Watches" },
  ];

  // Check which endpoints are available on component mount
  useEffect(() => {
    const checkEndpoints = async () => {
      const working = [];

      for (const { endpoint, category } of apiEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(`http://localhost:5000/${endpoint}`, {
            signal: controller.signal,
            method: "HEAD",
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            working.push({ endpoint, category });
          }
        } catch (error) {
          console.warn(`Endpoint ${endpoint} is not available:`, error.message);
        }
      }

      setAvailableEndpoints(working);
    };

    checkEndpoints();
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const allProducts = [];
        const endpointsToUse = availableEndpoints.length > 0 ? availableEndpoints : apiEndpoints;

        for (const { endpoint, category } of endpointsToUse) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`http://localhost:5000/${endpoint}`, {
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
              const data = await response.json();
              const normalizedData = Array.isArray(data) ? data : [data];
              const productsWithCategory = normalizedData
                .filter((item) => item && typeof item === "object")
                .map((item, index) => ({
                  ...item,
                  category: category,
                  id: item.id || item._id || `${endpoint}-${index}`,
                  name:
                    item.name ||
                    item.title ||
                    item.productName ||
                    item.Name ||
                    "Unnamed Product",
                  price: item.price || item.cost || item.amount || item.Price,
                  image: item.image || item.img || item.photo || item.Image,
                  description:
                    item.description || item.desc || item.Description || "",
                }));
              allProducts.push(...productsWithCategory);
            }
          } catch (error) {
            if (error.name !== "AbortError") {
              console.warn(`Failed to fetch from ${endpoint}:`, error.message);
            }
          }
        }

        // Filter products based on search query
        const filteredResults = allProducts.filter((product) => {
          const searchQuery = query.toLowerCase();
          const productName = (product.name || "").toLowerCase();
          const productDescription = (product.description || "").toLowerCase();
          const productCategory = (product.category || "").toLowerCase();

          return (
            productName.includes(searchQuery) ||
            productDescription.includes(searchQuery) ||
            productCategory.includes(searchQuery)
          );
        });

        // Sort results by relevance
        const sortedResults = filteredResults.sort((a, b) => {
          const queryLower = query.toLowerCase();
          const aName = (a.name || "").toLowerCase();
          const bName = (b.name || "").toLowerCase();

          if (aName === queryLower && bName !== queryLower) return -1;
          if (bName === queryLower && aName !== queryLower) return 1;
          if (aName.startsWith(queryLower) && !bName.startsWith(queryLower))
            return -1;
          if (bName.startsWith(queryLower) && !aName.startsWith(queryLower))
            return 1;

          return 0;
        });

        setResults(sortedResults);
      } catch (error) {
        console.error("Search error:", error);
        setError("An error occurred while searching. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, availableEndpoints]);

  // Generate placeholder image
  const getPlaceholderImage = (productName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    const hash = productName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const color = `hsl(${Math.abs(hash) % 360}, 70%, 85%)`;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 200, 200);

    ctx.fillStyle = "#333";
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(productName.charAt(0).toUpperCase(), 100, 100);

    return canvas.toDataURL();
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    // Create product object for cart
    const cartItem = {
      productId: `product_${product.id}`,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || getPlaceholderImage(product.name),
      category: product.category,
    };

    // Dispatch custom event for cart update
    const event = new CustomEvent("cartUpdate", {
      detail: { product: cartItem, action: "add" },
    });
    window.dispatchEvent(event);

    // Show success message
    alert(`Added ${product.name} to cart!`);
  };

  // Navigate to product details
  const navigateToProductDetails = (product) => {
    // Store product in session storage for retrieval on the details page
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
    
    // Navigate based on product category
    if (product.category === "Earbuds") {
      navigate(`/earbuds/${product.id}`);
    } else if (product.category === "Monitors") {
      navigate(`/monitor/${product.id}`);
    } else if (product.category === "Headsets") {
      navigate(`/headset/${product.id}`);
    } else if (product.category === "Shoes") {
      navigate(`/shoe/${product.id}`);
    } else if (product.category === "T-Shirts") {
      navigate(`/tshirt/${product.id}`);
    } else if (product.category === "Watches") {
      navigate(`/watch/${product.id}`);
    } else if (product.category === "Cases") {
      navigate(`/case/${product.id}`);
    } else if (product.category === "Lights") {
      navigate(`/light/${product.id}`);
    } else if (product.category === "Cooling") {
      navigate(`/cool/${product.id}`);
    } else if (product.category === "Cycles") {
      navigate(`/cycle/${product.id}`);
    } else if (product.category === "Power Banks") {
      navigate(`/power/${product.id}`);
    } else if (product.category === "Table Stands") {
      navigate(`/stand/${product.id}`);
    } else {
      // Default fallback
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col">
            <h2 className="display-6 mb-0">Search Results for "{query}"</h2>
            <p className="text-muted">Found {results.length} products</p>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : results.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {results.map((product) => (
              <div key={`${product.category}-${product.id}`} className="col">
                <div className="card h-100 shadow-sm hover-shadow">
                  <div className="position-relative">
                    <img
                      src={product.image || getPlaceholderImage(product.name)}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "200px", objectFit: "contain", padding: "1rem" }}
                      onError={(e) => {
                        e.target.src = getPlaceholderImage(product.name);
                      }}
                    />
                    {product.discount && (
                      <span className="position-absolute top-0 end-0 bg-success text-white m-2 px-2 py-1 rounded-pill">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-secondary text-capitalize">{product.category}</span>
                      {product.brand && (
                        <span className="text-muted small">{product.brand}</span>
                      )}
                    </div>
                    <h5 className="card-title mb-1">{product.name}</h5>
                    {product.rating && (
                      <div className="mb-2">
                        <span className="text-warning">
                          {'★'.repeat(Math.floor(product.rating))}
                          {product.rating % 1 >= 0.5 ? '½' : ''}
                          {'☆'.repeat(5 - Math.ceil(product.rating))}
                        </span>
                        <small className="text-muted ms-1">({product.rating})</small>
                      </div>
                    )}
                    <div className="mb-3">
                      {product.price && (
                        <div className="d-flex align-items-center">
                          <span className="fs-5 fw-bold text-primary me-2">
                            ₹{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-decoration-line-through text-muted small">
                              ₹{typeof product.originalPrice === 'number' ? product.originalPrice.toLocaleString() : product.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto d-grid gap-2">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleAddToCart(product)}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigateToProductDetails(product)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center my-5">
            <div className="mb-4">
              <i className="bi bi-search fs-1 text-muted"></i>
            </div>
            <h3>No results found</h3>
            <p className="text-muted">
              We couldn't find any products matching "{query}". Try using different keywords or browse our categories.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Browse All Products
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Card,
  Badge,
  InputGroup,
  FormControl,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { PlusCircle, DashCircle, Trash, CartPlus } from "react-bootstrap-icons";
import { RefreshCw } from "react-feather";

import Navbar from "./Navbar";

const Cart = () => {
  // API base URL
  const API_BASE_URL = "http://localhost:5000";

  // API endpoints configuration
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

  // State management
  const [cartItems, setCartItems] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    message: "",
    variant: "success",
  });
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState({});

  // Load cart from MongoDB on component mount
  useEffect(() => {
    initializeCart();
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = (event) => {
      const { product, action } = event.detail;

      if (action === "add") {
        addToCart(product);
      } else if (action === "refresh") {
        fetchCartItems();
      }
    };

    window.addEventListener("cartUpdate", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdate", handleCartUpdate);
    };
  }, []);

  // Initialize cart and products
  const initializeCart = async () => {
    await Promise.all([fetchCartItems(), fetchAvailableProducts()]);
    setLoading(false);
  };

  // Fetch cart items from MongoDB
  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart`);

      if (response.ok) {
        const data = await response.json();
        setCartItems(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch cart items:", response.statusText);
        displayAlert("Failed to load cart items", "danger");
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      displayAlert("Error loading cart", "danger");
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  // Fetch sample products from multiple API endpoints
  const fetchAvailableProducts = async () => {
    try {
      const allProducts = [];
      let globalProductIndex = 0; // Global counter for unique IDs

      // Fetch from a few endpoints for demonstration
      const endpointsToFetch = apiEndpoints.slice(0, 5); // Fetch first 5 for demo

      for (const { endpoint, category } of endpointsToFetch) {
        try {
          const response = await fetch(`${API_BASE_URL}/${endpoint}`);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              const productsWithCategory = data.slice(0, 2).map((product) => {
                globalProductIndex++; // Increment for each product
                return {
                  ...product,
                  category,
                  // Create unique IDs using endpoint and global index
                  id: `${endpoint}_${globalProductIndex}_${
                    product.id || product._id || Date.now()
                  }`,
                  image:
                    product.images?.[0] ||
                    product.image ||
                    "/api/placeholder/200/150",
                  price: product.discountedPrice || product.price || 0,
                  originalPrice: product.originalPrice || product.price || 0,
                  name:
                    product.name ||
                    product.brand ||
                    product.title ||
                    "Unknown Product",
                };
              });
              allProducts.push(...productsWithCategory);
            }
          }
        } catch (error) {
          console.error(`Error fetching from ${endpoint}:`, error);
        }
      }

      setAvailableProducts(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      displayAlert("Error loading products", "warning");
    }
  };

  // Function to add item to cart via API
  const addToCart = async (product) => {
    const productId = `${product.id}_${product.selectedColor || "default"}`;

    try {
      setOperationLoading((prev) => ({ ...prev, [productId]: true }));

      const cartItem = {
        productId,
        name: product.name || product.brand || "Unknown Product",
        price:
          product.selectedPrice ||
          product.discountedPrice ||
          product.price ||
          0,
        quantity: product.quantity || 1,
        image:
          product.selectedImage ||
          product.image ||
          product.images?.[0] ||
          "/api/placeholder/200/150",
        color: product.selectedColorName || product.selectedColor || "",
        size: product.selectedSizeName || product.selectedSize || "",
        category: product.category || "General",
      };

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        const updatedItem = await response.json();

        // Update local state
        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) => item.productId === updatedItem.productId
          );

          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedCartItems = [...prevItems];
            updatedCartItems[existingItemIndex] = updatedItem;
            return updatedCartItems;
          } else {
            // Add new item
            return [...prevItems, updatedItem];
          }
        });

        const productName = product.name || product.brand || "Product";
        const colorInfo = product.selectedColorName
          ? ` (${product.selectedColorName})`
          : "";
        displayAlert(`Added ${productName}${colorInfo} to cart`, "success");
      } else {
        const errorData = await response.json();
        displayAlert(
          errorData.message || "Failed to add item to cart",
          "danger"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      displayAlert("Error adding item to cart", "danger");
    } finally {
      setOperationLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Function to remove item from cart via API
  const removeItem = async (itemId) => {
    try {
      setOperationLoading((prev) => ({ ...prev, [itemId]: true }));

      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const itemToRemove = cartItems.find((item) => item._id === itemId);
        setCartItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
        displayAlert(
          `Removed ${itemToRemove?.name || "item"} from cart`,
          "info"
        );
      } else {
        const errorData = await response.json();
        displayAlert(errorData.message || "Failed to remove item", "danger");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      displayAlert("Error removing item from cart", "danger");
    } finally {
      setOperationLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Function to update quantity via API
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setOperationLoading((prev) => ({ ...prev, [`${itemId}_qty`]: true }));

      const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setCartItems((prevItems) =>
          prevItems.map((item) => (item._id === itemId ? updatedItem : item))
        );
      } else {
        const errorData = await response.json();
        displayAlert(
          errorData.message || "Failed to update quantity",
          "danger"
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      displayAlert("Error updating quantity", "danger");
    } finally {
      setOperationLoading((prev) => ({ ...prev, [`${itemId}_qty`]: false }));
    }
  };

  // Function to increase quantity
  const increaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item._id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  // Function to decrease quantity
  const decreaseQuantity = (itemId) => {
    const item = cartItems.find((item) => item._id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      setCartLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems([]);
        displayAlert("Cart cleared successfully", "success");
      } else {
        const errorData = await response.json();
        displayAlert(errorData.message || "Failed to clear cart", "danger");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      displayAlert("Error clearing cart", "danger");
    } finally {
      setCartLoading(false);
    }
  };

  // Refresh cart data
  const refreshCart = async () => {
    await fetchCartItems();
    displayAlert("Cart refreshed", "info");
  };

  // Display alert message
  const displayAlert = (message, variant) => {
    setAlertInfo({ message, variant });
    setShowAlert(true);

    // Auto-hide alert after 4 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
      .toFixed(2);
  };

  // Calculate total items in cart
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <>
        <Navbar cartCount={0} />
        <div className="container mt-4">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Loading cart...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar cartCount={totalItems} />

      <div className="container mt-4">
        {showAlert && (
          <Alert
            variant={alertInfo.variant}
            className="animate__animated animate__fadeIn"
            dismissible
            onClose={() => setShowAlert(false)}
          >
            {alertInfo.message}
          </Alert>
        )}

        <Row>
          {/* Shopping Cart */}
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Shopping Cart</h4>
                <div className="d-flex align-items-center gap-3">
                  <Badge bg="light" text="dark" pill>
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </Badge>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={refreshCart}
                    disabled={cartLoading}
                  >
                    <RefreshCw
                      className={
                        cartLoading ? "spinner-border spinner-border-sm" : ""
                      }
                    />
                  </Button>
                  {cartItems.length > 0 && (
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={clearCart}
                      disabled={cartLoading}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                {cartLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-5">
                    <i
                      className="bi bi-cart"
                      style={{ fontSize: "3rem", color: "#6c757d" }}
                    ></i>
                    <h5 className="mt-3">Your cart is empty</h5>
                    <p className="text-muted">
                      Browse our products and add items to your cart.
                    </p>
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="rounded"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/200/150";
                                }}
                              />
                              <div className="ms-3">
                                <h6 className="mb-0">{item.name}</h6>
                                <small className="text-muted">
                                  {item.category}
                                </small>
                                {item.color && (
                                  <small className="d-block text-info">
                                    Color: {item.color}
                                  </small>
                                )}
                                {item.size && (
                                  <small className="d-block text-info">
                                    Size: {item.size}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>₹{(item.price || 0).toFixed(2)}</td>
                          <td>
                            <InputGroup size="sm" style={{ width: "130px" }}>
                              <Button
                                variant="outline-secondary"
                                onClick={() => decreaseQuantity(item._id)}
                                disabled={
                                  item.quantity <= 1 ||
                                  operationLoading[`${item._id}_qty`]
                                }
                              >
                                <DashCircle />
                              </Button>
                              <FormControl
                                value={item.quantity}
                                className="text-center"
                                readOnly
                              />
                              <Button
                                variant="outline-secondary"
                                onClick={() => increaseQuantity(item._id)}
                                disabled={operationLoading[`${item._id}_qty`]}
                              >
                                {operationLoading[`${item._id}_qty`] ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <PlusCircle />
                                )}
                              </Button>
                            </InputGroup>
                          </td>
                          <td>
                            <strong>
                              ₹{((item.price || 0) * item.quantity).toFixed(2)}
                            </strong>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeItem(item._id)}
                              disabled={operationLoading[item._id]}
                            >
                              {operationLoading[item._id] ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <Trash />
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="fs-5 text-primary">
                    ₹{calculateTotal()}
                  </strong>
                </div>
                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  size="lg"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => (window.location.href = "/")}
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>

            {/* Available Products */}
            <Card className="shadow-sm">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">You Might Like</h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={fetchAvailableProducts}
                >
                  <RefreshCw />
                </Button>
              </Card.Header>
              <Card.Body>
                {availableProducts.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0">No products available</p>
                  </div>
                ) : (
                  availableProducts.map((product) => {
                    const productId = `${product.id}_${
                      product.selectedColor || "default"
                    }`;
                    return (
                      <div
                        key={product.id} // Using the unique product.id as key
                        className="d-flex align-items-center mb-3 pb-3 border-bottom"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="rounded"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src = "/api/placeholder/200/150";
                          }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h6
                            className="mb-0 text-truncate"
                            style={{ maxWidth: "150px" }}
                          >
                            {product.name}
                          </h6>
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-success fw-bold">
                              ₹{(product.price || 0).toFixed(2)}
                            </small>
                            {product.originalPrice > product.price && (
                              <small className="text-muted text-decoration-line-through">
                                ₹{product.originalPrice.toFixed(2)}
                              </small>
                            )}
                          </div>
                          {product.category && (
                            <Badge bg="secondary" className="mt-1">
                              {product.category}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={operationLoading[productId]}
                        >
                          {operationLoading[productId] ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <>
                              <CartPlus className="me-1" /> Add
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Cart;

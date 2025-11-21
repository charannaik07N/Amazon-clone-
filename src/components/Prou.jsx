import React from "react";


const categories = [
  { name: "Grocery", icon: "🛒" },
  { name: "Mobiles", icon: "📱" },
  { name: "Fashion", icon: "👗" },
  { name: "Electronics", icon: "💻" },
  { name: "Home & Furniture", icon: "🛋️" },
  { name: "Appliances", icon: "🔌" },
  { name: "Flight Bookings", icon: "✈️" },
  { name: "Beauty, Toys & More", icon: "🧸" },
  { name: "Two Wheelers", icon: "🏍️" },
];

const styles = {
  container: {
    padding: "1.5rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  navbar: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "1rem",
    overflowX: "auto", // Enable horizontal scrolling if needed
    whiteSpace: "nowrap", // Prevent wrapping
  },
  grid: {
    display: "flex", // Change from grid to flexbox
    gap: "1rem",
    justifyContent: "space-between",
  },
  categoryItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(0,0,0,0.1)",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "120px", // Ensure consistent size
  },
  categoryItemHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#f8f9fa",
  },
  iconContainer: {
    fontSize: "2rem",
    padding: "10px",
    borderRadius: "50%",
    backgroundColor: "#f8f9fa",
    marginBottom: "0.5rem",
    transition: "all 0.3s ease",
  },
  categoryName: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#495057",
    textAlign: "center",
  },
};

function Prou() {
  const handleClick = (category) => {
    alert(`You clicked on ${category}`);
  };

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.grid}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                ...styles.categoryItem,
                ...(hoveredIndex === index ? styles.categoryItemHover : {}),
              }}
              onClick={() => handleClick(category.name)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span
                style={{
                  ...styles.iconContainer,
                  ...(hoveredIndex === index
                    ? {
                        transform: "scale(1.1)",
                        backgroundColor: "#e9ecef",
                      }
                    : {}),
                }}
              >
                {category.icon}
              </span>
              <span style={styles.categoryName}>{category.name}</span>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Prou;

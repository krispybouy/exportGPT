import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [hover, setHover] = useState(null);

  const handleMouseEnter = (index) => setHover(index);
  const handleMouseLeave = () => setHover(null);

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.sidebarTitle}>ExportGPT</h2>
      <ul style={styles.sidebarList}>
        {["/ai-assistant", "/extract-data", "/market-intelligence", "/amazon-global"].map((path, index) => (
          <li style={styles.sidebarItem} key={index}>
            <Link
              to={path}
              style={{
                ...styles.sidebarLink,
                ...(hover === index ? styles.sidebarLinkHover : {}),
              }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {path.split("/")[1].replace("-", " ").toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    background: "linear-gradient(135deg, #1a3d66, #2c4e77)", // Darker gradient background
    color: "#fff",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)",
    fontFamily: "'Roboto', sans-serif", // Modern, clean font
  },
  sidebarTitle: {
    fontSize: "2rem", // Bigger font size for the title
    marginBottom: "20px",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "bold",
  },
  sidebarList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    marginBottom: "15px",
  },
  sidebarLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px 20px",
    display: "block",
    fontSize: "1.1rem", // Reduced font size for the page names
    fontWeight: "500", // Medium weight font
    transition: "all 0.3s ease",
    borderRadius: "5px",
    width: "100%", // Ensures the link spans the full width of the sidebar
  },
  // Hover effect with a darker blue background color covering the entire width
  sidebarLinkHover: {
    backgroundColor: "#1c2e56", // Darker blue background on hover
    transform: "scale(1.05)", // Slight zoom effect
  },
};

export default Sidebar;

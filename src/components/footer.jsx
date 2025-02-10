import React, { useState, useEffect } from "react";
import "../css/Footer.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setIsVisible(true); // Show footer when at bottom
      } else {
        setIsVisible(false); // Hide footer otherwise
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className={`footer ${isVisible ? "visible" : "hidden"}`}>
      <p>© {new Date().getFullYear()} Abishek S. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

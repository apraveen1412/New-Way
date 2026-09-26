import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <main className="not-found-page">

      {/* Background decoration */}
      <div className="not-found-glow glow-one"></div>
      <div className="not-found-glow glow-two"></div>

      <div className="not-found-container">

        {/* Illustration */}
        <div className="not-found-visual">

          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="planet">
            <span className="planet-crater crater-one"></span>
            <span className="planet-crater crater-two"></span>
            <span className="planet-crater crater-three"></span>
          </div>

          <div className="floating-dot dot-one"></div>
          <div className="floating-dot dot-two"></div>
          <div className="floating-dot dot-three"></div>

        </div>

        {/* Content */}
        <div className="not-found-content">

          <span className="not-found-eyebrow">
            PAGE NOT FOUND
          </span>

          <h1 className="not-found-number">
            404
          </h1>

          <h2>
            Oops! We lost that page.
          </h2>

          <p>
            The page you're looking for doesn't exist, was moved,
            or may have been removed.
          </p>

          <Link to="/home" className="not-found-button">
            <span>Back to Homepage</span>
            <span className="button-arrow">→</span>
          </Link>

        </div>

      </div>
    </main>
  );
};

export default NotFound;







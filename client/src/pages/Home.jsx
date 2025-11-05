import { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Simulate image loading delay
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* Add your image here */}
        <div className={`hero-image ${imageLoaded ? "loaded" : ""}`}>
          <img
            src="/path/to/your/image.jpg"
            alt="Hero"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* You can add text, buttons etc here later */}
        <div className="hero-text">{/* Future content goes here */}</div>
      </div>
    </section>
  );
};

export default Home;

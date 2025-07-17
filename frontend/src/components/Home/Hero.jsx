import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  
  const heroTexts = [
    "Discover Your Next Great Read",
    "Explore Endless Stories",
    "Find Your Literary Adventure"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Text rotation animation with fade effect
    const interval = setInterval(() => {
      setIsTextVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentText((prev) => (prev + 1) % heroTexts.length);
        setIsTextVisible(true); // Start fade in
      }, 300); // Half second for fade out, then change text and fade in
    }, 4000);
    
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  return (
    <div className="min-h-[60vh] md:h-[75vh] flex flex-col lg:flex-row items-center gap-8 lg:gap-0 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
      
      <div className={`w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center order-2 lg:order-1 px-4 lg:px-0 relative z-10 transform transition-all duration-1000 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left leading-tight mb-4">
          <span className={`inline-block transform transition-all duration-500 hover:scale-105 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            {heroTexts[currentText]}
          </span>
        </h1>
        <p className={`mt-4 text-base md:text-xl text-zinc-300 text-center lg:text-left max-w-lg transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          Uncover captivating stories, enriching knowledge, and endless
          inspiration in our curated collection of books
        </p>
        <div className={`mt-6 md:mt-8 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link 
            to="/all-books" 
            className="text-yellow-100 text-lg md:text-xl lg:text-2xl font-semibold border-2 border-yellow-100 px-6 md:px-10 py-2 md:py-3 hover:bg-yellow-100 hover:text-zinc-900 rounded-full transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-100/50 relative overflow-hidden group"
          >
            <span className="relative z-10">Discover Books</span>
            <div className="absolute inset-0 bg-yellow-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
        </div>
      </div>
      
      <div className={`w-full lg:w-3/6 h-auto flex items-center justify-center order-1 lg:order-2 transform transition-all duration-1000 delay-700 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="relative">
          <img 
            src="./book-store-vector.png" 
            alt="hero" 
            className="h-48 md:h-64 lg:h-full max-h-96 w-auto object-contain animate-float hover:scale-105 transition-transform duration-300" 
          />
          {/* Floating particles */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-10 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

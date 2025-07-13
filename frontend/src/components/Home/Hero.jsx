import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-[60vh] md:h-[75vh] flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
      <div className="w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center order-2 lg:order-1 px-4 lg:px-0">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left leading-tight">
          Discover Your Next Great Read
        </h1>
        <p className="mt-4 text-base md:text-xl text-zinc-300 text-center lg:text-left max-w-lg">
          Uncover captivating stories, enriching knowledge, and endless
          inspiration in our curated collection of books
        </p>
        <div className="mt-6 md:mt-8">
          <Link 
            to="/all-books" 
            className="text-yellow-100 text-lg md:text-xl lg:text-2xl font-semibold border border-yellow-100 px-6 md:px-10 py-2 md:py-3 hover:bg-zinc-800 rounded-full transition-all duration-300 inline-block"
          >
            Discover Books
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-3/6 h-auto flex items-center justify-center order-1 lg:order-2">
        <img 
          src="./book-store-vector.png" 
          alt="hero" 
          className="h-48 md:h-64 lg:h-full max-h-96 w-auto object-contain" 
        />
      </div>
    </div>
  );
};

export default Hero;

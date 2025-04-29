import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import Lottie from 'lottie-react';
import travelAnim1 from '../../assets/travel.json';
import travelAnim2 from '../../assets/travel2.json';
import travelAnim3 from '../../assets/travel3.json';

const animations = [travelAnim1, travelAnim2, travelAnim3];

export default function Hero() {
  const [currentAnimIndex, setCurrentAnimIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimIndex((prevIndex) => (prevIndex + 1) % animations.length);
    }, 4000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-white">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <Lottie
          animationData={animations[currentAnimIndex]}
          loop
          autoplay
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-extrabold text-[50px] md:text-[60px] leading-tight mb-6">
          <span className="text-[#4731ed] block">Smart Travel, Smarter Itineraries</span>
          <span className="text-gray-800">Let AI Plan Your Perfect Trip!</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Your AI-Powered Travel Guru: Crafting Personalized Itineraries Perfectly Aligned with Your Interests & Budget!
        </p>
        <Link to="/create-trip">
          <Button className="px-8 py-4 rounded-full bg-black text-white hover:bg-gray-900 transition duration-300 text-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}

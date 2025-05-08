import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src= "/src/assets/Shuri.png"
              alt="ShuriSketch Logo" 
              className="w-10 h-10"
            />
            <span className="text-xl font-semibold text-gray-800">ShuriSketch</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
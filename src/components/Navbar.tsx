import React from 'react';
import { Bike as BikeIcon } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <BikeIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Bali<span className="text-primary italic">2</span>Ride
          </span>
        </div>

        {/* Center: Removed Title */}
        <div className="text-center">
        </div>

        {/* Right: Empty spacer */}
        <div className="flex justify-end items-center gap-4">
        </div>
      </div>
    </nav>
  );
};


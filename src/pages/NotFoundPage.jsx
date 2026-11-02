import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="py-16 text-center space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#656d76]">
        <Compass className="w-8 h-8 animate-pulse text-orange-600" />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[#1f2328]">404</h1>
        <h2 className="text-base font-semibold text-[#1f2328]">
          This branch doesn't exist
        </h2>
        <p className="text-xs text-[#656d76]">
          The page or route you are looking for in the DevFlow repository could not be located.
        </p>
      </div>

      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="sm" icon={Home}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

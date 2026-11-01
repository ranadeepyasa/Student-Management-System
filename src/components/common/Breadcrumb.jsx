import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-xs text-[#656d76] mb-3" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#0969da] transition-colors"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="font-medium">DevFlow</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400" />
            {isLast || !item.to ? (
              <span className="font-semibold text-[#1f2328]">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-[#0969da] transition-colors font-medium"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

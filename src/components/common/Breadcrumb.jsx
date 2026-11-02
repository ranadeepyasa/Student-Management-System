import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-orange-600 transition-colors"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5 text-orange-600" />
        <span className="font-semibold text-slate-800">Student System</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 mx-1.5 text-slate-400" />
            {isLast || !item.to ? (
              <span className="font-semibold text-slate-900">{item.label}</span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-orange-600 transition-colors font-medium text-slate-600"
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

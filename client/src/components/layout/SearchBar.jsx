import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search tasks, tags...' }) => {
  return (
    <div className="relative w-full max-w-xs md:max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 text-sm bg-card/80 border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
          type="button"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
import React, { useState } from 'react';
import { Search, Globe, X } from 'lucide-react';

const ENGINES = [
  { name: 'Local', url: null, placeholder: 'Search bookmarks...', color: 'blue' },
  { name: 'Google', url: 'https://www.google.com/search?q=', placeholder: 'Search with Google', color: 'red' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=', placeholder: 'Search with Bing', color: 'teal' },
  { name: 'Baidu', url: 'https://www.baidu.com/s?wd=', placeholder: '百度一下', color: 'blue' },
];

const SearchBar = ({ onLocalSearch }) => {
  const [engine, setEngine] = useState(ENGINES[0]);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (engine.name === 'Local') {
      onLocalSearch(query);
    } else {
      window.open(engine.url + encodeURIComponent(query), '_blank');
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (engine.name === 'Local') {
      onLocalSearch(val);
    }
  };

  const clearQuery = () => {
    setQuery('');
    onLocalSearch('');
  };

  return (
    <div className={`w-full max-w-3xl mx-auto mb-12 transition-all duration-500 transform ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
      <div className="flex justify-center gap-2 mb-4">
        {ENGINES.map((eng) => (
          <button
            key={eng.name}
            onClick={() => {
                setEngine(eng);
                if (eng.name === 'Local') onLocalSearch(query);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              engine.name === eng.name 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
              : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {eng.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <input
          type="text"
          className="block w-full pl-14 pr-12 py-4 border-none rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 border border-white/10"
          placeholder={engine.placeholder}
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
        />
        {query && (
          <button 
            type="button"
            onClick={clearQuery}
            className="absolute inset-y-0 right-12 pr-2 flex items-center text-white/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button 
          type="submit" 
          className="absolute inset-y-0 right-0 pr-5 flex items-center text-white/60 hover:text-white transition-colors group"
        >
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-500 transition-colors shadow-lg">
            <Globe className="h-4 w-4 text-white" />
          </div>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

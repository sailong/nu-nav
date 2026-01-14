import React, { useEffect, useState } from 'react';
import api from '../api';
import SearchBar from '../components/SearchBar';
import { ExternalLink, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [filter, setFilter] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchData();
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [catsRes, settingsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/settings')
      ]);
      setCategories(catsRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter logic
  const filteredCategories = categories.map(cat => {
    const filteredTags = cat.tags.filter(tag => 
      tag.name.toLowerCase().includes(filter.toLowerCase()) || 
      (tag.description && tag.description.toLowerCase().includes(filter.toLowerCase()))
    );
    return { ...cat, tags: filteredTags };
  }).filter(cat => cat.tags.length > 0);

  const bgImage = settings.backgroundImage || 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070';

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col flex-1">
        <header className="flex justify-between items-center px-6 py-6 md:px-12">
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xl">N</div>
               Nu-Nav
            </h1>
            <Link to="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white/90 text-sm font-medium transition-colors">
              Admin
            </Link>
        </header>

        <main className="flex-1 flex flex-col md:flex-row px-6 md:px-12 pb-12 gap-8">
            {/* Sidebar Navigation */}
            <aside className="hidden md:block w-64 shrink-0">
               <nav className="sticky top-8 space-y-1">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 px-3">Categories</p>
                  {filteredCategories.map(cat => (
                    <a 
                      key={cat.id} 
                      href={`#cat-${cat.id}`}
                      className="block px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                    >
                      {cat.name}
                    </a>
                  ))}
               </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 max-w-5xl">
                <SearchBar onLocalSearch={setFilter} />

                <div className="space-y-16 mt-8">
                  {filteredCategories.map(category => (
                    <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-8">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3 drop-shadow-sm">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        {category.name}
                        <span className="text-white/30 text-xs font-normal ml-2">{category.tags.length} items</span>
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {category.tags.map(tag => (
                          <a 
                            key={tag.id}
                            href={tag.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/30"
                          >
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                              {tag.logo ? (
                                <img src={tag.logo} alt={tag.name} className="w-full h-full object-cover" />
                              ) : (
                                <ExternalLink className="w-6 h-6 text-white/70" />
                              )}
                            </div>
                            <div className="text-center w-full">
                              <h3 className="text-white font-medium text-sm truncate">{tag.name}</h3>
                              {tag.description && (
                                 <p className="text-white/40 text-[10px] truncate mt-0.5">{tag.description}</p>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </section>
                  ))}
                  
                  {filteredCategories.length === 0 && filter && (
                     <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                        <p className="text-white/70 text-lg">No tags found matching "{filter}"</p>
                        <button 
                          onClick={() => setFilter('')}
                          className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                        >
                          Clear search
                        </button>
                     </div>
                  )}
                </div>
            </div>
        </main>

        <footer className="relative z-10 py-8 px-6 text-center text-white/30 text-sm border-t border-white/5 mx-12">
            &copy; 2026 Nu-Nav Navigation. Built with Speed and Style.
        </footer>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-600 text-white shadow-2xl transition-all duration-300 transform ${
            showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          } hover:bg-blue-500 hover:scale-110 active:scale-95`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Home;

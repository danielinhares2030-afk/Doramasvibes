import React, { useState } from 'react';
import { Search, Compass, Tv } from 'lucide-react';
import { DoramaCard } from './UIComponents';

export default function CatalogView({ doramas, onSelect }) {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Todos', 'Romance', 'Comédia', 'Ação', 'Fantasia', 'Thriller', 'Mistério', 'BL/GL', 'Histórico'];
  const origins = ['K-Drama', 'C-Drama', 'J-Drama', 'Thai-Drama', 'TW-Drama'];
  const statusList = ['Em Lançamento', 'Finalizado'];

  const filteredDoramas = doramas.filter(d => {
    const matchSearch = d.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Todos' || d.genre === filter || d.origin === filter || d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="pb-10">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-anime text-white">Explorar</h2>
          <button onClick={() => setShowFilters(!showFilters)} className="text-pink-500 text-xs font-bold tracking-widest uppercase border border-pink-500/30 px-4 py-2 rounded-xl bg-pink-500/10 flex items-center gap-2">
            Filtros <Compass size={16}/>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Search size={18} /></div>
          <input type="text" placeholder="Buscar por título..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:border-pink-500 outline-none transition-all placeholder:text-slate-500 font-semibold shadow-inner"/>
        </div>

        {showFilters && (
          <div className="mb-6 bg-slate-900/50 border border-slate-800 rounded-2xl p-5 animate-fade-in-up">
            <div className="mb-5">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">Gêneros</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === c ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">Origem</p>
              <div className="flex flex-wrap gap-2">
                {origins.map(o => (
                  <button key={o} onClick={() => setFilter(o)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === o ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">Status</p>
              <div className="flex flex-wrap gap-2">
                {statusList.map(s => (
                  <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === s ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {filteredDoramas.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Tv size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-sm font-bold uppercase tracking-widest text-white mb-2">Nada Encontrado</p>
            <p className="text-xs max-w-[250px] mx-auto">Tente ajustar os filtros ou pesquisar por outro nome.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredDoramas.map(dorama => (
              <DoramaCard key={dorama.id} dorama={dorama} onClick={() => onSelect(dorama)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

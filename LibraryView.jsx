import React from 'react';
import { Bookmark } from 'lucide-react';
import { DoramaCard } from './UIComponents';

export default function LibraryView({ doramas, onSelect }) {
  return (
    <div className="px-4 py-6 pb-10">
      <h2 className="text-2xl font-anime text-white mb-6">Minha Lista</h2>
      
      {doramas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800 shadow-inner">
            <Bookmark size={32} className="text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 tracking-wide">Sua lista está vazia</h3>
          <p className="text-sm text-slate-400 max-w-[250px]">Explore o catálogo e adicione seus doramas favoritos aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {doramas.map(dorama => (
            <DoramaCard key={dorama.id} dorama={dorama} onClick={() => onSelect(dorama)} />
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

export const CustomLoader = () => (
  <div className="flex flex-col items-center justify-center py-40 text-pink-500 min-h-screen bg-slate-950">
    <Loader2 className="animate-spin" size={40} />
  </div>
);

export const DoramaCard = ({ dorama, onClick }) => (
  <div onClick={onClick} className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[2/3] bg-slate-900 border border-slate-800 shadow-lg hover:border-pink-500/50 transition-all">
    <img src={dorama.image || "https://images.unsplash.com/photo-1616098319696-6b22c4f74d0e?w=500"} alt={dorama.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
    
    {/* Degradê mais escuro embaixo para a leitura ficar perfeita */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
    
    <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
      
      {/* Gênero organizado logo acima do título */}
      {dorama.genre && (
        <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-1 block">
          {dorama.genre}
        </span>
      )}
      
      <h3 className="text-white font-bold text-sm line-clamp-2 drop-shadow-md leading-tight mb-1.5">
        {dorama.title || 'Título Desconhecido'}
      </h3>
      
      <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
        <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">{dorama.origin || 'K-Drama'}</span> 
        <span className="flex items-center gap-0.5 text-yellow-500">★ {dorama.rating || 'N/A'}</span>
      </div>
    </div>
  </div>
);

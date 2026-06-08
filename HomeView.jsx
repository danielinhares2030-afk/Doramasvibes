import React from 'react';
import { Tv, Play } from 'lucide-react';
import { DoramaCard, CustomLoader } from './UIComponents';

export default function HomeView({ doramas, isFetching, onSelect, onNavigateCatalog }) {
  if (isFetching) return <CustomLoader />;

  if (doramas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-slate-500 px-6 text-center">
        <Tv size={60} className="mx-auto mb-6 text-slate-700" />
        <p className="text-lg font-bold uppercase tracking-widest text-white mb-2">Sem Lançamentos</p>
        <p className="text-sm">Vá no Firebase e adicione documentos na coleção 'doramas' para preencher a Home.</p>
      </div>
    );
  }

  const heroDorama = doramas[0];
  const populares = doramas.slice(0, 10);
  const atualizacoes = doramas.slice().reverse().slice(0, 10);

  return (
    <div className="pb-10 overflow-x-hidden">
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900 cursor-pointer group" onClick={() => onSelect(heroDorama)}>
        <img src={heroDorama.coverImage || heroDorama.image || "https://images.unsplash.com/photo-1616098319696-6b22c4f74d0e?w=1000"} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider mb-3 inline-block">Destaque</span>
          <h1 className="text-4xl md:text-5xl font-anime text-white drop-shadow-lg leading-tight mb-2">{heroDorama.title || 'Título Desconhecido'}</h1>
          <p className="text-slate-300 text-sm line-clamp-2 max-w-lg mb-4">{heroDorama.description || 'Assista agora este sucesso aclamado no nosso catálogo.'}</p>
          <div className="flex items-center gap-3">
            <button className="bg-white text-slate-950 font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-200 uppercase tracking-widest text-sm">
              <Play size={16} fill="currentColor" /> Assistir
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNavigateCatalog(); }} className="bg-slate-900/80 backdrop-blur border border-slate-700 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 uppercase tracking-widest text-sm">
              Mais Info
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-white px-5 mb-4 border-l-4 border-pink-500 ml-4 pl-3">Populares</h2>
        <div className="flex overflow-x-auto gap-4 px-5 pb-6 snap-x hide-scrollbar">
          {populares.map(dorama => (
            <div key={dorama.id} className="snap-start flex-none w-36 sm:w-40 md:w-48">
              <DoramaCard dorama={dorama} onClick={() => onSelect(dorama)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <h2 className="text-lg font-bold text-white px-5 mb-4 border-l-4 border-purple-500 ml-4 pl-3">Novas Atualizações</h2>
        <div className="flex overflow-x-auto gap-4 px-5 pb-6 snap-x hide-scrollbar">
          {atualizacoes.map(dorama => (
            <div key={dorama.id} className="snap-start flex-none w-36 sm:w-40 md:w-48">
              <DoramaCard dorama={dorama} onClick={() => onSelect(dorama)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, Suspense, lazy } from 'react';
import { ArrowLeft, Share2, Play, Plus, Check, Download } from 'lucide-react';
import { CustomLoader } from './UIComponents';

const PlayerView = lazy(() => import('./PlayerView'));

export default function DoramaDetailsView({ dorama, onClose, isSaved, onToggleSave, onToast }) {
  const [playingEpisode, setPlayingEpisode] = useState(null);

  if (!dorama) return null;

  const episodios = dorama.episodios_lista || dorama.episodios || [];

  const handleAssistirTop = () => {
    if (episodios.length > 0) {
      setPlayingEpisode(episodios[0]);
    } else {
      if(onToast) onToast("Nenhum episódio disponível ainda.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto animate-fade-in-up">
      
      {/* O Player renderiza AQUI em cima, isolado, não substitui a tela do Dorama! */}
      <Suspense fallback={null}>
        {playingEpisode && (
          <PlayerView 
            episode={playingEpisode} 
            episodios={episodios} 
            doramaTitle={dorama.title} 
            setPlayingEpisode={setPlayingEpisode}
            onClose={() => setPlayingEpisode(null)} 
          />
        )}
      </Suspense>

      <div className="fixed top-0 w-full z-40 flex justify-between p-4 bg-gradient-to-b from-slate-950/80 to-transparent">
        <button onClick={onClose} className="w-10 h-10 bg-slate-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-slate-800"><ArrowLeft size={20} /></button>
        <button className="w-10 h-10 bg-slate-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-slate-800"><Share2 size={18} /></button>
      </div>

      <div className="relative w-full h-[50vh] bg-slate-900">
        <img src={dorama.coverImage || dorama.image || "https://images.unsplash.com/photo-1616098319696-6b22c4f74d0e?w=1000"} alt="Cover" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="px-5 relative z-10 -mt-24 max-w-4xl mx-auto pb-20">
        <div className="flex items-end gap-5 mb-6">
          <img src={dorama.image || "https://images.unsplash.com/photo-1616098319696-6b22c4f74d0e?w=500"} alt="Poster" className="w-32 rounded-xl shadow-2xl border-2 border-slate-800 object-cover aspect-[2/3]" />
          <div className="pb-1">
            <h1 className="text-3xl font-anime text-white drop-shadow-lg leading-tight mb-2">{dorama.title}</h1>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300">
              <span className="text-pink-500 border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 rounded">{dorama.year || '2024'}</span>
              <span>{episodios.length > 0 ? `${episodios.length} Episódios` : (dorama.episodes ? `${dorama.episodes} Episódios` : '?')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold mb-6 flex-wrap">
          <span className="text-green-400">{dorama.relevance || '98%'} Relevante</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">{dorama.ageRating || '14+'}</span>
          <span className="text-slate-400">{dorama.genre || 'Drama'}</span>
        </div>

        <div className="flex gap-3 mb-8">
          <button onClick={handleAssistirTop} className="flex-1 bg-white text-slate-950 font-black py-3.5 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-200 transition-colors uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Play size={18} fill="currentColor" /> Assistir
          </button>
          <button onClick={onToggleSave} className={`w-14 h-[52px] rounded-xl flex items-center justify-center transition-colors border shadow-lg ${isSaved ? 'bg-pink-500/20 border-pink-500 text-pink-500' : 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'}`}>
            {isSaved ? <Check size={22} /> : <Plus size={22} />}
          </button>
          <button className="w-14 h-[52px] bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-white hover:bg-slate-800 transition-colors shadow-lg">
            <Download size={20} />
          </button>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-8 border-l-2 border-slate-700 pl-4">
          {dorama.description || 'Nenhuma descrição disponível para este dorama ainda. Fique ligado para mais atualizações em breve no catálogo!'}
        </p>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Episódios</h3>
          <div className="space-y-4">
            {episodios.length === 0 ? (
              <div className="text-slate-500 text-sm py-4 italic">Nenhum episódio cadastrado para este dorama no momento.</div>
            ) : (
              episodios.map((ep, idx) => (
                <div key={idx} onClick={() => setPlayingEpisode(ep)} className="flex gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/80 transition-colors cursor-pointer group">
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0 border border-slate-700">
                    <img src={dorama.coverImage || dorama.image || "https://images.unsplash.com/photo-1616098319696-6b22c4f74d0e?w=500"} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-md group-hover:scale-110 transition-transform">
                        <Play size={12} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="text-white font-bold text-sm mb-1 line-clamp-1 group-hover:text-pink-400 transition-colors">
                      Episódio {ep.numero || idx + 1}: {ep.titulo || ep.title || ''}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {ep.sinopse || ep.description || 'Assista a este episódio agora mesmo!'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowLeft, ExternalLink, SkipBack, SkipForward } from 'lucide-react';

export default function PlayerView({ episode, episodios, doramaTitle, setPlayingEpisode, onClose }) {
  // Encontra o index do episódio atual para saber qual é o Próximo/Anterior
  const currentIndex = episodios.findIndex(ep => (ep.videoUrl || ep.link) === (episode.videoUrl || episode.link));
  const hasNext = currentIndex >= 0 && currentIndex < episodios.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => { if (hasNext) setPlayingEpisode(episodios[currentIndex + 1]); };
  const handlePrev = () => { if (hasPrev) setPlayingEpisode(episodios[currentIndex - 1]); };

  let isDirectVideo = false;
  let finalVideoUrl = episode?.videoUrl || episode?.link || '';

  // Lógica inteligente de conversão e proteção (Mantida intacta)
  if (finalVideoUrl) {
    if (finalVideoUrl.includes('<iframe') && finalVideoUrl.includes('src=')) {
      const match = finalVideoUrl.match(/src=["'](.*?)["']/);
      if (match && match[1]) finalVideoUrl = match[1];
    }
    
    if (finalVideoUrl.includes('drive.google.com')) {
      finalVideoUrl = finalVideoUrl.replace(/\/view.*?$/, '/preview');
      if (!finalVideoUrl.includes('/preview')) {
        const driveMatch = finalVideoUrl.match(/\/d\/(.*?)\//);
        if(driveMatch) finalVideoUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
    }

    if (finalVideoUrl.includes('mega.nz/file/')) {
      finalVideoUrl = finalVideoUrl.replace('mega.nz/file/', 'mega.nz/embed/');
    }

    if (finalVideoUrl.includes('youtube.com/watch?v=')) {
      finalVideoUrl = finalVideoUrl.replace('watch?v=', 'embed/');
    } else if (finalVideoUrl.includes('youtu.be/')) {
      finalVideoUrl = finalVideoUrl.replace('youtu.be/', 'youtube.com/embed/');
    }

    if (finalVideoUrl.includes('vimeo.com/') && !finalVideoUrl.includes('player.vimeo.com')) {
       const vimeoId = finalVideoUrl.split('vimeo.com/')[1];
       finalVideoUrl = `https://player.vimeo.com/video/${vimeoId}`;
    }

    if (finalVideoUrl.includes('dai.ly/')) {
      const dailyId = finalVideoUrl.split('dai.ly/')[1].split('?')[0];
      finalVideoUrl = `https://www.dailymotion.com/embed/video/${dailyId}`;
    } else if (finalVideoUrl.includes('dailymotion.com/video/')) {
      const dailyId = finalVideoUrl.split('dailymotion.com/video/')[1].split('?')[0];
      finalVideoUrl = `https://www.dailymotion.com/embed/video/${dailyId}`;
    }
    
    isDirectVideo = finalVideoUrl.toLowerCase().match(/\.(mp4|webm|ogg)$/i) !== null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col overflow-y-auto animate-slide-in-right hide-scrollbar">
      
      {/* HEADER FIXO DO PLAYER */}
      <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 shadow-md">
        <button onClick={onClose} className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 px-4 text-center overflow-hidden">
          <h2 className="text-white font-black text-sm uppercase tracking-widest truncate">{doramaTitle}</h2>
          <p className="text-pink-500 text-xs font-bold truncate">
            {episode?.numero ? `Episódio ${episode.numero}` : 'Episódio'} {episode?.titulo ? `- ${episode.titulo}` : ''}
          </p>
        </div>
        <a href={finalVideoUrl} target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-pink-500 hover:bg-slate-800 transition-colors" title="Abrir link externo">
           <ExternalLink size={18} />
        </a>
      </div>
      
      {/* ÁREA DE VÍDEO (REMOVIDO AUTOPLAY) */}
      <div className="w-full aspect-video bg-black relative shrink-0">
        {isDirectVideo ? (
           <video src={finalVideoUrl} controls className="w-full h-full object-contain outline-none"></video>
        ) : (
           <iframe src={finalVideoUrl} className="w-full h-full" frameBorder="0" allowFullScreen allow="fullscreen; encrypted-media; picture-in-picture"></iframe>
        )}
      </div>

      {/* CONTROLES E INFORMAÇÕES ADICIONAIS */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* BOTÕES DE PULAR */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button 
            onClick={handlePrev} 
            disabled={!hasPrev} 
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${hasPrev ? 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-700' : 'bg-slate-900/50 text-slate-700 border border-slate-800/50 cursor-not-allowed'}`}
          >
            <SkipBack size={16} /> Anterior
          </button>
          <button 
            onClick={handleNext} 
            disabled={!hasNext} 
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${hasNext ? 'bg-pink-600 text-white hover:bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-slate-900/50 text-slate-700 border border-slate-800/50 cursor-not-allowed'}`}
          >
            Próximo <SkipForward size={16} />
          </button>
        </div>

        {/* LISTA DE EPISÓDIOS DENTRO DO PLAYER */}
        <div>
          <h3 className="text-white font-bold mb-4 border-l-4 border-pink-500 pl-3">Todos os Episódios</h3>
          <div className="space-y-3">
            {episodios.map((ep, idx) => {
              const isPlaying = (ep.videoUrl || ep.link) === (episode.videoUrl || episode.link);
              return (
                <div 
                  key={idx} 
                  onClick={() => setPlayingEpisode(ep)} 
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${isPlaying ? 'bg-pink-500/10 border-pink-500/50 scale-[1.02]' : 'bg-slate-900 border-slate-800 hover:border-pink-500/30'}`}
                >
                  <h4 className={`font-bold text-sm mb-1 line-clamp-1 ${isPlaying ? 'text-pink-400' : 'text-white'}`}>
                    Episódio {ep.numero || idx + 1}: {ep.titulo || ep.title || ''}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {ep.sinopse || ep.description || 'Assista a este episódio agora mesmo!'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

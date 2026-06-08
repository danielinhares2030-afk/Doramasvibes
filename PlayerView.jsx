import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function PlayerView({ episode, doramaTitle, onClose }) {
  let isDirectVideo = false;
  let finalVideoUrl = episode?.videoUrl || episode?.link || '';

  if (finalVideoUrl) {
    if (finalVideoUrl.includes('<iframe') && finalVideoUrl.includes('src=')) {
      const match = finalVideoUrl.match(/src=["'](.*?)["']/);
      if (match && match[1]) {
        finalVideoUrl = match[1];
      }
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
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col animate-fade-in-up">
      {/* HEADER DO PLAYER COM NOME DO EPISÓDIO */}
      <div className="absolute top-0 w-full z-50 flex justify-between p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-white font-black text-sm uppercase tracking-widest drop-shadow-md">{doramaTitle}</h2>
            <p className="text-pink-400 text-xs font-bold">
              {episode?.numero ? `Episódio ${episode.numero}` : 'Episódio'} {episode?.titulo ? `- ${episode.titulo}` : ''}
            </p>
          </div>
        </div>
        
        <a href={finalVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] text-white font-bold uppercase tracking-widest hover:bg-slate-700 cursor-pointer bg-slate-800/80 px-4 py-2 rounded-full backdrop-blur-md border border-slate-600 transition-colors shadow-lg">
           <ExternalLink size={14} className="text-pink-500" /> Link Externo
        </a>
      </div>
      
      {/* ÁREA DE VÍDEO CENTRALIZADA (SEM AUTOPLAY) */}
      <div className="flex-1 flex items-center justify-center bg-black w-full h-full relative px-4 pb-4 pt-20">
        {isDirectVideo ? (
           <video src={finalVideoUrl} controls className="w-full max-h-full object-contain outline-none rounded-xl bg-slate-900 shadow-2xl"></video>
        ) : (
           <iframe src={finalVideoUrl} className="w-full h-full rounded-xl bg-slate-900 shadow-2xl" frameBorder="0" allowFullScreen allow="fullscreen; encrypted-media; picture-in-picture"></iframe>
        )}
      </div>
    </div>
  );
}

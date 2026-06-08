import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function PlayerView({ playingVideo, setPlayingVideo }) {
  let isDirectVideo = false;
  let finalVideoUrl = playingVideo;

  if (playingVideo) {
    if (playingVideo.includes('<iframe') && playingVideo.includes('src=')) {
      const match = playingVideo.match(/src=["'](.*?)["']/);
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
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in-up">
      <div className="absolute top-0 w-full z-50 flex justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => setPlayingVideo(null)} className="w-10 h-10 bg-slate-900/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-colors"><ArrowLeft size={20} /></button>
        <div className="flex flex-col items-center mt-1">
          <h3 className="text-white font-bold text-sm tracking-widest uppercase drop-shadow-md">Player</h3>
          <a href={finalVideoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-pink-400 font-bold uppercase tracking-widest hover:text-pink-300 mt-1 cursor-pointer bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-md border border-pink-500/30">
             <ExternalLink size={10} /> Tela branca? Clique aqui
          </a>
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-black w-full h-full relative">
        {isDirectVideo ? (
           <video src={finalVideoUrl} controls autoPlay className="w-full max-h-full object-contain outline-none"></video>
        ) : (
           <iframe src={finalVideoUrl} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; fullscreen; encrypted-media; picture-in-picture"></iframe>
        )}
      </div>
    </div>
  );
}

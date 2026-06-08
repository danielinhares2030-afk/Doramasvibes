import React from 'react';

export default function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Shojumaru&family=Teko:wght@400;600;700&display=swap');
      
      body { font-family: 'Nunito', sans-serif; background-color: #020617; color: white; margin: 0; padding: 0; }
      .font-anime { font-family: 'Shojumaru', cursive; }
      .font-teko { font-family: 'Teko', sans-serif; }
      
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }

      @keyframes slide-in-right {
        0% { transform: translateX(100%); }
        100% { transform: translateX(0); }
      }
      .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
    `}} />
  );
}

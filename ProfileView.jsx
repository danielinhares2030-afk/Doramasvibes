import React from 'react';
import { Edit3, Calendar, MapPin, Heart, Star, ShieldCheck, LogOut } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebase';

export default function ProfileView({ profileData, onToast, onEdit }) {
  const getCountryFlag = (countryName) => {
    if(!countryName) return '';
    const map = { 'brasil': '🇧🇷', 'coreia': '🇰🇷', 'japão': '🇯🇵', 'japao': '🇯🇵', 'china': '🇨🇳', 'tailândia': '🇹🇭', 'tailandia': '🇹🇭', 'eua': '🇺🇸', 'portugal': '🇵🇹' };
    return map[countryName.toLowerCase()] || '';
  }

  const avatarUrl = profileData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
  const coverUrl = profileData.capa || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000";

  return (
    <div className="pb-10 bg-slate-950 relative">
      <div className="relative w-full h-48 md:h-64 bg-slate-900">
        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      </div>

      <div className="px-5 relative z-10 -mt-12 max-w-4xl mx-auto">
        <div className="flex flex-row items-end gap-5">
          <div className="w-28 h-28 shrink-0 rounded-full border-4 border-slate-950 overflow-hidden bg-slate-800 shadow-xl">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 pb-2">
            <h2 className="text-3xl font-anime text-white drop-shadow-md truncate">
              {profileData.nome || 'Dorama Fã'}
            </h2>
            <p className="text-sm text-slate-400 font-bold truncate">
              {auth.currentUser?.email || 'Usuário Convidado'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={onEdit} className="w-auto inline-flex items-center gap-2 bg-slate-900 border border-slate-700 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-lg">
            <Edit3 size={16} /> Editar Perfil
          </button>
        </div>

        <div className="mt-6 bg-slate-900/50 border border-slate-800 p-5 rounded-2xl shadow-inner">
          <p className="text-sm text-slate-300 italic font-semibold border-l-2 border-pink-500 pl-3">
            "{profileData.biografia || 'Escreva sua jornada no mundo dos doramas...'}"
          </p>
        </div>

        <div className="mt-8 mb-6">
          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4 border-l-2 border-pink-500 pl-3">Ficha de Fã</h3>
          <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 snap-x px-1">
            <div className="snap-start min-w-[130px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg hover:border-blue-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20"><Calendar size={20} /></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Idade</span>
              <span className="text-lg font-black text-white">{profileData.idade || '--'}</span>
            </div>
            
            <div className="snap-start min-w-[130px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg hover:border-green-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20"><MapPin size={20} /></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">País</span>
              <span className="text-lg font-black text-white flex items-center gap-2">
                {profileData.pais || '--'} 
                {getCountryFlag(profileData.pais) && <span className="text-2xl drop-shadow-md">{getCountryFlag(profileData.pais)}</span>}
              </span>
            </div>
            
            <div className="snap-start min-w-[170px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg text-center hover:border-pink-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20"><Heart size={20} /></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dorama Fav</span>
              <span className="text-sm font-bold text-white line-clamp-2 px-2">{profileData.doramaFavorito || '--'}</span>
            </div>
            
            <div className="snap-start min-w-[170px] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg text-center hover:border-purple-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20"><Star size={20} /></div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ator/Atriz</span>
              <span className="text-sm font-bold text-white line-clamp-2 px-2">{profileData.atorFavorito || '--'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4 border-l-2 border-pink-500 pl-3">Privacidade & Acesso</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg mb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className={profileData.isPrivate ? "text-pink-500" : "text-slate-500"} size={24} />
              <div>
                <p className="text-sm font-bold text-white">Conta Privada</p>
                <p className="text-xs text-slate-400">Ocultar perfil de outros usuários</p>
              </div>
            </div>
            <button 
              onClick={async () => {
                try {
                  await setDoc(doc(db, 'usuarios', auth.currentUser.uid), { isPrivate: !profileData.isPrivate }, { merge: true });
                } catch(e) {}
              }}
              className={`w-12 h-6 rounded-full relative transition-colors ${profileData.isPrivate ? 'bg-pink-500' : 'bg-slate-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${profileData.isPrivate ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <button onClick={() => signOut(auth)} className="w-full bg-slate-900 border border-slate-800 text-rose-500 font-bold py-4 rounded-2xl transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 shadow-lg mb-10">
            <LogOut size={18} /> Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}

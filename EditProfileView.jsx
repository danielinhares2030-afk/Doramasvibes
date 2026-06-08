import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { compressImage } from './utils';

export default function EditProfileView({ profileData, onBack, onToast }) {
  const [form, setForm] = useState(profileData || {});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, (base64) => {
        setForm(prev => ({ ...prev, [field]: base64 }));
      });
    }
  };

  const saveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setSaving(true);
    try {
      const cleanForm = Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== undefined));
      await setDoc(doc(db, 'usuarios', user.uid), cleanForm, { merge: true });
      onToast("Perfil atualizado com sucesso!");
      onBack();
    } catch (error) {
      onToast("Erro ao salvar. Verifique sua conexão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto pb-20 font-nunito animate-fade-in-up">
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-800 z-10">
        <button onClick={onBack} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Editar Perfil</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-5 max-w-xl mx-auto space-y-6 mt-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Foto de Perfil</label>
          <div className="flex items-center gap-4">
            <img src={form.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700" alt="" />
            <label className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl text-center text-xs uppercase tracking-widest cursor-pointer hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <ImageIcon size={16} /> Trocar Foto
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, 'avatar')} />
            </label>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Capa de Fundo</label>
          <div className="flex items-center gap-4">
            <img src={form.capa || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000"} className="w-24 h-14 rounded-lg object-cover border-2 border-slate-700" alt="" />
            <label className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl text-center text-xs uppercase tracking-widest cursor-pointer hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <ImageIcon size={16} /> Trocar Capa
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e, 'capa')} />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Nome</label><input type="text" name="nome" value={form.nome || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:border-pink-500 outline-none font-bold" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Idade</label><input type="number" name="idade" value={form.idade || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:border-pink-500 outline-none font-bold" /></div>
            <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">País</label><input type="text" name="pais" value={form.pais || ''} onChange={handleChange} placeholder="Ex: Brasil" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:border-pink-500 outline-none font-bold" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Dorama Favorito</label><input type="text" name="doramaFavorito" value={form.doramaFavorito || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:border-pink-500 outline-none font-bold text-sm" /></div>
            <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Ator/Atriz</label><input type="text" name="atorFavorito" value={form.atorFavorito || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:border-pink-500 outline-none font-bold text-sm" /></div>
          </div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Biografia</label><textarea name="biografia" value={form.biografia || ''} onChange={handleChange} rows="3" className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 focus:border-pink-500 outline-none font-bold resize-none"></textarea></div>
        </div>

        <button onClick={saveProfile} disabled={saving} className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(236,72,153,0.3)] flex justify-center items-center gap-2">
          {saving ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';

export default function LoginScreen({ onToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      if(error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'){
        onToast("E-mail ou senha incorretos.");
        setPassword('');
      } else if (error.code === 'auth/email-already-in-use') {
        onToast("Este e-mail já está em uso.");
      } else {
        onToast("Erro ao autenticar.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      onToast("Erro ao entrar como anônimo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-8 w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 animate-fade-in-up">
        <div className="text-center mb-10 mt-2">
          <h1 className="text-3xl md:text-4xl font-anime text-white mb-3 tracking-wider drop-shadow-lg whitespace-nowrap">
            Doramas<span className="text-pink-500">Vibe</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Mail size={18} /></div>
            <input type="email" required placeholder="Seu E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-4 pl-11 pr-4 focus:border-pink-500 outline-none transition-all placeholder:text-slate-600 font-semibold"/>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500"><Lock size={18} /></div>
            <input type="password" required placeholder="Sua Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-xl py-4 pl-11 pr-4 focus:border-pink-500 outline-none transition-all placeholder:text-slate-600 font-semibold"/>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(219,39,119,0.3)] hover:shadow-[0_0_30px_rgba(219,39,119,0.5)] transition-all uppercase tracking-widest text-sm flex items-center justify-center mt-6">
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-slate-400 text-sm font-bold hover:text-white transition-colors">
            {isLogin ? 'Não tem conta? Criar' : 'Já tem conta? Entrar'}
          </button>
          <div className="w-full h-px bg-slate-800 relative flex justify-center items-center my-2">
            <span className="bg-slate-900 px-3 text-xs text-slate-500 font-bold tracking-widest uppercase">Ou</span>
          </div>
          <button onClick={handleAnonymous} disabled={loading} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm uppercase tracking-widest">
            Entrar como Convidado
          </button>
        </div>
      </div>
    </div>
  );
}

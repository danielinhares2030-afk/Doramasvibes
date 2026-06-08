import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Search, Home, Bookmark, User, Bell, X, Info, Tv, Loader2, MessageCircle, Compass } from 'lucide-react';
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, query, orderBy, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from './firebase';
import GlobalStyles from './GlobalStyles';
import LoginScreen from './LoginScreen';
import { CustomLoader } from './UIComponents';

const HomeView = lazy(() => import('./HomeView'));
const CatalogView = lazy(() => import('./CatalogView'));
const LibraryView = lazy(() => import('./LibraryView'));
const ProfileView = lazy(() => import('./ProfileView'));
const EditProfileView = lazy(() => import('./EditProfileView'));
const DoramaDetailsView = lazy(() => import('./DoramaDetailsView'));

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  
  const [doramas, setDoramas] = useState([]);
  const [library, setLibrary] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [notificacoes, setNotificacoes] = useState([]); 

  const [activeTab, setActiveTab] = useState('home');
  const [selectedDorama, setSelectedDorama] = useState(null);
  const [toast, setToast] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    setIsFetchingData(true);

    const unsubDoramas = onSnapshot(collection(db, 'doramas'), (snapshot) => {
      setDoramas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsFetchingData(false);
    });
    
    const unsubLibrary = onSnapshot(collection(db, 'usuarios', user.uid, 'library'), (snapshot) => {
      setLibrary(snapshot.docs.map(doc => doc.id));
    });
    
    const unsubProfile = onSnapshot(doc(db, 'usuarios', user.uid), (docSnap) => {
      setProfileData(docSnap.exists() ? docSnap.data() : {});
    });

    const qNotificacoes = query(collection(db, 'notificacoes'), orderBy('createdAt', 'desc'));
    const unsubNotif = onSnapshot(qNotificacoes, (snapshot) => {
      setNotificacoes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubDoramas(); unsubLibrary(); unsubProfile(); unsubNotif(); };
  }, [user]);

  return (
    <>
      <GlobalStyles />

      {showSplash && (
        <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-32 h-32 border-t-4 border-pink-500 border-solid rounded-full animate-[spin_1.5s_linear_infinite] shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
            <div className="absolute w-24 h-24 border-b-4 border-purple-500 border-solid rounded-full animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
            <Tv size={40} className="text-pink-500 animate-pulse drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-anime tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500 animate-fade-in-up drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] mb-3 whitespace-nowrap">
            DoramasVibe
          </h1>
          <p className="text-slate-400 text-[10px] tracking-[0.3em] uppercase font-bold animate-pulse">Carregando emoções...</p>
        </div>
      )}

      {isLoadingAuth && !showSplash && <CustomLoader />}

      {!isLoadingAuth && !user && !showSplash && (
        <>
          <LoginScreen onToast={showToast} />
          {toast && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-800/95 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 font-bold text-sm">
              <Info size={18} className="text-pink-400 shrink-0" /> <span className="break-words w-full">{toast}</span>
            </div>
          )}
        </>
      )}

      {!isLoadingAuth && user && !showSplash && (
        <div className="min-h-screen bg-slate-950 text-white font-nunito pb-24 pt-20 selection:bg-pink-500/30">
          
          <header className="fixed top-0 left-0 w-full z-40 bg-slate-950/85 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between shadow-md">
            <h1 className="text-xl font-anime tracking-wider text-white drop-shadow-md">
              Doramas<span className="text-pink-500">Vibe</span>
            </h1>
            <div className="flex items-center gap-5">
              <Search className="text-slate-400 hover:text-white transition-colors cursor-pointer" size={22} onClick={() => setActiveTab('catalog')} />
              
              <div className="relative cursor-pointer" onClick={() => setShowNotifications(true)}>
                <Bell className="text-slate-400 hover:text-white transition-colors" size={22} />
                {notificacoes.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 border-2 border-slate-950 rounded-full"></span>
                )}
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-slate-700 relative cursor-pointer" onClick={() => setActiveTab('profile')}>
                <img src={profileData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </header>

          <main className="animate-fade-in-up">
            <Suspense fallback={<CustomLoader />}>
              {activeTab === 'home' && <HomeView doramas={doramas} isFetching={isFetchingData} onSelect={setSelectedDorama} onNavigateCatalog={() => setActiveTab('catalog')} />}
              {activeTab === 'catalog' && <CatalogView doramas={doramas} onSelect={setSelectedDorama} />}
              {activeTab === 'library' && <LibraryView doramas={doramas.filter(d => library.includes(d.id))} onSelect={setSelectedDorama} />}
              {activeTab === 'profile' && <ProfileView profileData={profileData} onToast={showToast} onEdit={() => setIsEditingProfile(true)} />}
            </Suspense>
          </main>

          <nav className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-40 safe-area-pb">
            {[
              { id: 'home', icon: Home, label: 'Início' },
              { id: 'catalog', icon: Compass, label: 'Catálogo' },
              { id: 'library', icon: Bookmark, label: 'Salvos' },
              { id: 'profile', icon: User, label: 'Perfil' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === tab.id ? 'text-pink-500 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                <span className="text-[10px] font-bold tracking-widest uppercase">{tab.label}</span>
              </button>
            ))}
          </nav>

          {showNotifications && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={() => setShowNotifications(false)}></div>
              <div className="relative w-full max-w-sm bg-slate-950 h-full border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in-right">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Bell size={20} className="text-pink-500" />
                    <h2 className="text-lg font-bold text-white tracking-widest uppercase">Notificações</h2>
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"><X size={18}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
                  {notificacoes.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 font-bold uppercase tracking-widest text-xs">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    notificacoes.map((notif) => (
                      <div key={notif.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-pink-500/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${notif.type === 'aviso' ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white' : 'bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white'}`}>
                            {notif.type === 'aviso' ? <Info size={20}/> : <MessageCircle size={20}/>}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{notif.title || 'Aviso do Sistema'}</h4>
                            <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-widest">
                              {notif.createdAt?.toDate ? new Date(notif.createdAt.toDate()).toLocaleDateString() : 'Recente'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 break-words">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedDorama && (
            <Suspense fallback={<CustomLoader />}>
              <DoramaDetailsView 
                dorama={selectedDorama} 
                onClose={() => setSelectedDorama(null)} 
                isSaved={library.includes(selectedDorama.id)}
                onToast={showToast}
                onToggleSave={async () => {
                  try {
                    const docRef = doc(db, 'usuarios', user.uid, 'library', selectedDorama.id);
                    if (library.includes(selectedDorama.id)) {
                      await deleteDoc(docRef);
                      showToast('Removido da biblioteca');
                    } else {
                      await setDoc(docRef, { savedAt: serverTimestamp() });
                      showToast('Salvo na biblioteca!');
                    }
                  } catch (e) {
                    showToast('Erro ao salvar. Verifique a internet.');
                  }
                }}
              />
            </Suspense>
          )}

          {isEditingProfile && (
            <Suspense fallback={<CustomLoader />}>
              <EditProfileView profileData={profileData} onBack={() => setIsEditingProfile(false)} onToast={showToast} />
            </Suspense>
          )}

          {toast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-800/95 backdrop-blur-xl text-white px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 flex items-center gap-3 border border-slate-700/50 font-bold text-sm animate-fade-in-up">
              <Info size={20} className="text-pink-400 shrink-0" /> <span className="break-words w-full">{toast}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

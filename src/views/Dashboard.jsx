import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { 
  FaBalanceScale, FaShieldAlt, FaUserShield, FaGavel, 
  FaFileContract, FaLanguage, FaMicrophone, FaPaperPlane, 
  FaSignOutAlt, FaBars, FaTimes, FaCircle, FaRobot, FaUser 
} from 'react-icons/fa';
import { MdGavel } from 'react-icons/md';

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { 
    currentView, setCurrentView, backendStatus, checkBackendHealth,
    isRecording, simulateVoiceInput, input, setInput, messages, sendMessage 
  } = useChat();

  // Mapping array matches your exact project document features list
  const features = [
    { name: 'Legal Rights Awareness', icon: <FaBalanceScale /> },
    { name: 'Complaint Filing Guidance', icon: <FaFileContract /> },
    { name: 'Cybercrime Reporting Support', icon: <FaShieldAlt /> },
    { name: 'Consumer Protection Guidance', icon: <MdGavel /> }, // Full match!
    { name: 'Domestic Violence Reporting Support', icon: <FaGavel /> },
    { name: 'Legal Documentation Guidance', icon: <FaUserShield /> },
  ];

  // FIXED: Included 'checkBackendHealth' correctly inside the hook tracking array. 
  // Combined with our Context useCallback refactor, this safely prevents stale evaluations.
  useEffect(() => {
    checkBackendHealth();
  }, [checkBackendHealth]);

  // Structural helper keeping focus locked directly onto the latest chat entry bubble
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="h-screen w-screen flex bg-jurisCream overflow-hidden font-sans text-slate-800 select-none">
      
      {/* 1. DESKTOP PERMANENT NAVIGATION SIDEBAR */}
      <aside className="hidden md:flex md:w-72 bg-[#0d233a] flex-col text-slate-200 border-r border-slate-800/10 shrink-0">
        <div className="p-6 border-b border-slate-800/40 flex items-center gap-3 bg-slate-950/20">
          <FaBalanceScale className="text-[#00a896] text-2xl" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">JurisAI</h1>
            <p className="text-xs text-slate-400">Multilingual Assistant</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Core Modules</p>
          {features.map((feat) => (
            <button
              key={feat.name}
              onClick={() => setCurrentView(feat.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                currentView === feat.name 
                  ? 'bg-[#00a896] text-white shadow-md shadow-teal-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-base shrink-0">{feat.icon}</span>
              <span className="truncate">{feat.name}</span>
            </button>
          ))}
        </nav>

        {/* System Monitoring Status block */}
        <div className="p-4 border-t border-slate-800/40 bg-slate-950/30 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 text-xs">
            <FaCircle className={`text-[9px] ${backendStatus === 'online' ? 'text-emerald-500 animate-pulse' : backendStatus === 'offline' ? 'text-rose-500' : 'text-amber-500'}`} />
            <span className="text-slate-400">API Pipeline: <span className="text-slate-300 font-medium capitalize">{backendStatus}</span></span>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-red-950/30 hover:text-red-400 transition-all rounded-xl text-xs font-medium text-slate-400 border border-slate-700/40">
            <FaSignOutAlt /> Close Portal Session
          </button>
        </div>
      </aside>

      {/* 2. MOBILE RESPONSIVE SLIDE-OUT DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-72 bg-[#0d233a] h-full flex flex-col text-slate-200 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FaBalanceScale className="text-[#00a896] text-xl" />
                <span className="font-bold text-white text-lg">JurisAI Modules</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 text-xl p-2"><FaTimes /></button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {features.map((feat) => (
                <button
                  key={feat.name}
                  onClick={() => { setCurrentView(feat.name); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left ${
                    currentView === feat.name ? 'bg-[#00a896] text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base shrink-0">{feat.icon}</span>
                  <span className="truncate">{feat.name}</span>
                </button>
              ))}
            </nav>
            <button onClick={handleLogout} className="mt-auto w-full flex items-center justify-center gap-2 p-3 bg-slate-800 text-red-400 rounded-xl text-xs font-semibold">
              <FaSignOutAlt /> Log Out
            </button>
          </aside>
        </div>
      )}

      {/* 3. PRIMARY CONTENT & CHAT WINDOW CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f7f4eb] relative">
        
        {/* Dynamic Context Header Topbar */}
        <header className="h-16 bg-[#fdfbf7] border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between shadow-sm shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 hover:bg-slate-200/50 rounded-lg text-xl"><FaBars /></button>
            <h2 className="text-sm md:text-base font-bold text-[#0d233a] truncate">{currentView}</h2>
          </div>
          <div className="flex items-center gap-1.5 bg-[#00a896]/60 border border-[#00a896]/60 px-3 py-1.5 rounded-full text-[#00a896] font-semibold text-xs shadow-sm">
            <FaLanguage className="text-sm" />
            <span>ENG / regional</span>
          </div>
        </header>

        {/* Dynamic Chat Logs Workspace Panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f7f4eb] select-text">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] md:max-w-[78%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Identity Avatar Nodes */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-sm ${isUser ? 'bg-[#0d233a] text-white' : 'bg-[#00a896] text-white'}`}>
                      {isUser ? <FaUser /> : <FaRobot />}
                    </div>

                    {/* Text Message Card */}
                    <div className={`rounded-2xl p-4 text-sm shadow-sm leading-relaxed ${
                      isUser 
                        ? 'bg-[#0d233a] text-white rounded-tr-none' 
                        : 'bg-[#fdfbf7] border border-slate-200/60 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.isTyping ? (
                        <div className="flex space-x-1 py-1 px-1 items-center">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* User Interaction Input Box Footer */}
        <footer className="p-4 bg-[#fdfbf7] border-t border-slate-200/60 shrink-0 shadow-inner">
          <div className="max-w-3xl mx-auto flex items-center gap-2 bg-slate-100 rounded-2xl border border-slate-200 p-2 focus-within:border-[#00a896] focus-within:bg-white transition-all shadow-sm">
            <button 
              type="button" 
              onClick={simulateVoiceInput} 
              className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-[#00a896] hover:bg-slate-200/60'}`}
              title={isRecording ? "Listening..." : "Click to simulate voice speech-to-text input"}
            >
              <FaMicrophone className="text-base" />
            </button>
            
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={isRecording ? "Listening to Speech Input..." : `Ask about ${currentView}...`}
              disabled={isRecording}
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 px-2 disabled:text-slate-400 select-text" 
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)} 
            />
            
            <button 
              type="button" 
              onClick={() => sendMessage(input)} 
              className="p-3 bg-[#00a896] text-white rounded-xl hover:bg-teal-600 transition-all shadow-md shadow-teal-600/10"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2 tracking-wide font-medium">
            JurisAI Project Platform • Designed for IndiaSpan • Simplified Legal Guidance [cite: 2, 16]
          </p>
        </footer>

      </main>
    </div>
  );
}
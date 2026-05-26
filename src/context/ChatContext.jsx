import  { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

// Map explicit welcome text prompts matching your project case study report features
const featureWelcomeTexts = {
  'Legal Rights Awareness': 'Hello! I am JurisAI. Ask me any general legal questions to receive an easy-to-understand breakdown of your constitutional rights.',
  'Complaint Filing Guidance': 'Welcome to the Complaint Filing Guidance module. I can assist you with step-by-step procedures on how to file a police complaint or an official First Information Report (FIR).',
  'Cybercrime Reporting Support': 'Cybercrime Portal active. If you are facing online financial fraud, identity theft, or social harassment, describe it to discover immediate reporting steps.',
  'Consumer Protection Guidance': 'Consumer Protection Portal active. If you bought a defective item or received unfair services, let me help you look up rules for commercial grievances.',
  'Domestic Violence Reporting Support': 'Domestic Violence Support Node. This is a private space. I can guide you through protection orders, contact points, and immediate emergency legal numbers.',
  'Legal Documentation Guidance': 'Welcome to the Documentation Module. I can help simplify complex jargon regarding lease terms, basic affidavits, or notary formats.',
};

export function ChatProvider({ children }) {
  const [currentView, setCurrentView] = useState('Legal Rights Awareness');
  const [backendStatus, setBackendStatus] = useState('offline'); // Set to offline for UI-only presentation mode
  const [isRecording, setIsRecording] = useState(false);
  const [input, setInput] = useState('');

  // Auto-generate isolated chat bubbles state history map per module
  const [chatHistories, setChatHistories] = useState(
    Object.keys(featureWelcomeTexts).reduce((acc, feature) => {
      acc[feature] = [{ sender: 'bot', text: featureWelcomeTexts[feature] }];
      return acc;
    }, {})
  );

  // Health check handler simulation
  const checkBackendHealth = useCallback(async () => {
    // Stays offline since this is a frontend-driven high-fidelity demo session
    setBackendStatus('offline');
  }, []);

  const sendMessage = async (textToSubmit) => {
    if (!textToSubmit.trim()) return;

    const activeCategory = currentView;
    const updatedUserLogs = [...chatHistories[activeCategory], { sender: 'user', text: textToSubmit }];
    
    // 1. Immediately append user's text input to the active chat log
    setChatHistories(prev => ({ ...prev, [activeCategory]: updatedUserLogs }));
    setInput('');

    // 2. Append animated placeholder typing indicator block 
    setChatHistories(prev => ({
      ...prev,
      [activeCategory]: [...updatedUserLogs, { sender: 'bot', text: '...', isTyping: true }]
    }));

    // 3. High-Fidelity Interactive Demo Fallback Simulation (Simulating AI response times)
    setTimeout(() => {
      let simulatedReply = `I have logged your inquiry regarding "${textToSubmit}". Under standard legal provisions, this requires official verification.`;
      
      if (activeCategory === 'Legal Rights Awareness') {
        simulatedReply = `Under the Indian Constitution, your query regarding "${textToSubmit}" falls under fundamental protections. Every citizen is guaranteed equality before the law and statutory remedy under constitutional guidelines.`;
      } else if (activeCategory === 'Complaint Filing Guidance') {
        simulatedReply = `To proceed with your request: "${textToSubmit}", you should approach your local jurisdictional police station. If they refuse to lodge an official FIR, you can escalate the grievance directly to the Superintendent of Police under Section 154(3) of the CrPC.`;
      } else if (activeCategory === 'Cybercrime Reporting Support') {
        simulatedReply = `Immediate Safety Protocol: For financial or identity incidents like "${textToSubmit}", register an official complaint instantly at the National Cyber Crime Reporting Portal (www.cybercrime.gov.in) or call the central helpline at 1930.`;
      } else if (activeCategory === 'Consumer Protection Guidance') {
        simulatedReply = `Regarding "${textToSubmit}": Under the Consumer Protection Act, consumers can directly file a dispute against defective goods or deficient services before the District Consumer Disputes Redressal Commission without complex litigation steps.`;
      } else if (activeCategory === 'Domestic Violence Reporting Support') {
        simulatedReply = `Your privacy and security are paramount. For issues relating to "${textToSubmit}", immediate legal protection or residence orders can be invoked under the Protection of Women from Domestic Violence Act. Emergency legal aid support lines are reachable at 181 or 1091.`;
      } else if (activeCategory === 'Legal Documentation Guidance') {
        simulatedReply = `A standard legal draft for "${textToSubmit}" should outline precise terms, executed on non-judicial stamp paper of appropriate value. This must be attested by an authorized notary public or registered official to be legally binding.`;
      }

      // 4. Inject the smart simulated reply into the UI history layout and wipe typing indicator
      setChatHistories(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter(m => !m.isTyping).concat({
          sender: 'bot',
          text: simulatedReply
        })
      }));
    }, 1000); // 1-second simulated AI thinking delay
  };

  const simulateVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    
    // Simulates Speech-to-Text translation capture delay
    setTimeout(() => {
      setIsRecording(false);
      let simulatedQuery = "What primary legal steps should I initiate here?";
      if (currentView.includes("Cybercrime")) simulatedQuery = "My online banking transaction was compromised, how do I report it?";
      if (currentView.includes("Consumer")) simulatedQuery = "A merchant sold me a fake product and refuses to offer a refund.";
      
      setInput(simulatedQuery);
    }, 2000);
  };

  return (
    <ChatContext.Provider value={{
      currentView, setCurrentView,
      backendStatus, checkBackendHealth,
      isRecording, simulateVoiceInput,
      input, setInput,
      messages: chatHistories[currentView] || [],
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook helper declared cleanly
const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be wrapped inside a valid ChatProvider component tree.');
  }
  return context;
};

// Export structure that satisfies Vite's strict fast refresh boundary checks
// eslint-disable-next-line react-refresh/only-export-components
export { useChat };
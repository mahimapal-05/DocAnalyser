import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import UploadZone from './components/UploadZone';
import DocInsights from './components/DocInsights';
import ChatBox from './components/ChatBox';
import './App.css';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [chatHistory, setChatHistory] = useState({}); // { [docId]: [{role, content, thought_process}] }
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check if the backend is running and has the Groq API Key configured
    const checkBackendStatus = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setIsOnline(data.has_key);
        } else {
          setIsOnline(false);
        }
      } catch (err) {
        // If fetch fails, we assume we are running in local/fallback preview mode
        setIsOnline(false);
      }
    };
    checkBackendStatus();
  }, []);

  const activeDoc = documents.find((doc) => doc.id === activeDocId);

  const handleUploadSuccess = (newDoc) => {
    setIsLoadingDoc(false);
    setDocuments((prev) => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
    setChatHistory((prev) => ({
      ...prev,
      [newDoc.id]: []
    }));
  };

  const handleSendMessage = async (text) => {
    if (!activeDocId || isLoadingChat) return;

    // 1. Update local UI with user message
    const userMessage = { role: 'user', content: text };
    const currentDocHistory = chatHistory[activeDocId] || [];
    const updatedHistory = [...currentDocHistory, userMessage];

    setChatHistory((prev) => ({
      ...prev,
      [activeDocId]: updatedHistory
    }));

    setIsLoadingChat(true);

    try {
      // If it's a mock local sample document, we can generate a mock agent reply
      if (activeDocId.startsWith('sample-') || activeDocId.startsWith('mock-')) {
        simulateMockReply(text, updatedHistory);
        return;
      }

      // 2. Call backend chat api
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: activeDocId,
          message: text,
          history: currentDocHistory // Pass prior history
        })
      });

      if (!response.ok) {
        throw new Error("Backend response failed");
      }

      const data = await response.json();
      
      const assistantMessage = {
        role: 'model',
        content: data.answer,
        thought_process: data.thought_process
      };

      setChatHistory((prev) => ({
        ...prev,
        [activeDocId]: [...updatedHistory, assistantMessage]
      }));

    } catch (err) {
      // Fallback response on error
      const errMessage = {
        role: 'model',
        content: `⚠️ System Error: Unable to reach the AI agent. (Details: ${err.message}). If running locally, check if backend server is active on port 8000.`,
        thought_process: ["🔍 Intercepted chat send command", "❌ Failed to connect to /api/chat"]
      };
      setChatHistory((prev) => ({
        ...prev,
        [activeDocId]: [...updatedHistory, errMessage]
      }));
    } finally {
      setIsLoadingChat(false);
    }
  };

  const simulateMockReply = (query, history) => {
    setTimeout(() => {
      let answer = "";
      let thoughts = [];
      const queryLower = query.toLowerCase();

      if (activeDoc.category === 'medical') {
        thoughts = [
          "🔍 Analyzing query regarding medical results...",
          "🩺 Invoking MediSense clinical routing agent...",
          "💡 Searching document details for liver enzymes & lipid parameters...",
          "📝 Formatting medical explanation and standard safety disclaimer..."
        ];

        if (queryLower.includes('liver') || queryLower.includes('alt') || queryLower.includes('ast')) {
          answer = "According to the report, your liver enzymes are moderately elevated: **ALT is 74 U/L** (normal range is 7-56) and **AST is 61 U/L** (normal range is 10-40). This is referred to as mild **transaminitis**, which means there is some stress or irritation to your liver cells.\n\nThe doctor has noted this and requested a follow-up liver test in **6 weeks** to monitor how your body responds to the Lipitor, as statin medications can sometimes impact liver functions.\n\n> Disclaimer: This analysis is for educational purposes only. Please consult a qualified healthcare provider for any medical decisions or concerns.";
        } else if (queryLower.includes('medication') || queryLower.includes('lipitor') || queryLower.includes('atorvastatin')) {
          answer = "The physician has prescribed **Atorvastatin (Lipitor) 20mg daily**, to be taken at bedtime. This is intended to address your high LDL (bad) cholesterol, which is currently at **151 mg/dL** (target is under 100 mg/dL).\n\nKey notes on taking this medication:\n- You should limit or eliminate alcohol consumption.\n- You will need a repeat liver function test in 6 weeks.\n- Watch out for unexplained muscle fatigue or dark urine.\n\n> Disclaimer: This analysis is for educational purposes only. Please consult a qualified healthcare provider for any medical decisions or concerns.";
        } else {
          answer = "Based on the diagnostic report for John Doe, there are two primary findings:\n1. **Mixed Dyslipidemia**: High cholesterol (Total: 245, LDL: 151) and elevated Triglycerides (280).\n2. **Mild Transaminitis**: Elevated liver enzymes (ALT: 74, AST: 61).\n\nIf you have a specific question about these findings, please ask!\n\n> Disclaimer: This analysis is for educational purposes only. Please consult a qualified healthcare provider for any medical decisions or concerns.";
        }
      } else if (activeDoc.category === 'legal') {
        thoughts = [
          "🔍 Processing contract interrogation request...",
          "⚖️ Invoking LexGuard contract specialist...",
          "🔎 Locating terms regarding liabilities, termination, and billing...",
          "📝 Summarizing legalese into plain text..."
        ];

        if (queryLower.includes('renewal') || queryLower.includes('termination') || queryLower.includes('cancel')) {
          answer = "Under **Section 3 (Term and Automatic Renewal)**, this contract is active for an initial term of 12 months. \n\n**Critical Obligation:** It will **automatically renew** for another 12-month period unless you provide a written cancellation notice at least **90 days prior** to the end of the current term. If you miss this 90-day window, you are locked in for another full year.";
        } else if (queryLower.includes('liability') || queryLower.includes('risk') || queryLower.includes('sue')) {
          answer = "There is a substantial risk element in **Section 4 (Limitation of Liability)**.\n\n- The provider caps their total liability at **10 times the annual fees paid** by the client. Given the annual fee is $45,000, this limits liability to $450,000. While a 10x multiplier is highly favorable to the client compared to typical 1x caps, it remains a set ceiling.\n- Additionally, Section 6 includes a **Class Action Waiver**, which means you waive the right to resolve disputes through group litigation.";
        } else {
          answer = "This is a SaaS Services Agreement between **TechFlow Solutions Corp** and **Vertex Enterprise Inc**.\n\n- **Annual Fee**: $45,000 (Non-refundable)\n- **Term**: 12 months, auto-renewing with a 90-day cancellation notice.\n- **Governing Law**: State of Delaware.\n\nWhat legal clause can I clarify for you?";
        }
      } else if (activeDoc.category === 'educational') {
        thoughts = [
          "🔍 Analyzing physics lecture notes query...",
          "📚 Invoking EduScribe pedagogical agent...",
          "💡 Searching text for core formulas and principles...",
          "📝 Drafting interactive explanation and analogies..."
        ];

        if (queryLower.includes('uncertainty') || queryLower.includes('heisenberg')) {
          answer = "Werner Heisenberg's **Uncertainty Principle** (1927) states that you cannot measure both the exact position (\\(x\\)) and the exact momentum (\\(p\\)) of a particle at the same time.\n\nThe math is:\n**\\(\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}\\)**\n\n**Analogy**: Think of a fast-moving fan. To know exactly where a blade is, you must take a high-speed photo (stopping it, changing its speed). To know its exact speed, you must let it spin freely (so you can't point to its exact position).";
        } else if (queryLower.includes('equation') || queryLower.includes('schrodinger')) {
          answer = "The lecture covers **Schrödinger's Time-Independent Wave Equation**:\n\n**\\(Ĥ\\Psi = E\\Psi\\)**\n\n- **\\(Ĥ\\)**: The Hamiltonian operator, which represents the total kinetic and potential energy of the system.\n- **\\(\\Psi\\) (Psi)**: The Wave Function, which mathematically describes the quantum state of the particle.\n- **\\(E\\)**: The energy level.\n\nMost importantly, **\\(|\\Psi|^2\\)** represents the **probability density** of finding the electron or particle at a particular spot.";
        } else {
          answer = "These physics study notes cover **Chapter 3: Quantum Phenomena**. It explains:\n1. **Wave-Particle Duality** (light as photons, particles as waves).\n2. **Uncertainty Principle** (position/momentum limits).\n3. **Schrödinger Wave Equation** (probability states).\n\nAsk me to explain any equation or concept in detail!";
        }
      } else {
        thoughts = ["🔍 Analyzing general document question...", "🤖 Processing reply..."];
        answer = "This is a general document. I am ready to answer your questions based on its parsed text content!";
      }

      setChatHistory((prev) => ({
        ...prev,
        [activeDocId]: [
          ...history,
          {
            role: 'model',
            content: answer,
            thought_process: thoughts
          }
        ]
      }));
      setIsLoadingChat(false);
    }, 1500);
  };

  const handleNewDoc = () => {
    setActiveDocId(null);
  };

  const getModeClass = () => {
    if (!activeDoc) return '';
    return `mode-${activeDoc.category}`;
  };

  return (
    <div className={`app-container ${getModeClass()}`}>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      {/* Sidebar */}
      <Sidebar
        documents={documents}
        activeDocId={activeDocId}
        onSelectDoc={setActiveDocId}
        onNewDoc={handleNewDoc}
        isOnline={isOnline}
      />

      {/* Main workspace */}
      <main className="main-display">
        {!activeDoc ? (
          <UploadZone
            onUploadSuccess={handleUploadSuccess}
            onLoading={setIsLoadingDoc}
            isLoading={isLoadingDoc}
          />
        ) : (
          <div className="workspace-layout">
            <DocInsights doc={activeDoc} />
            <ChatBox
              messages={chatHistory[activeDocId] || []}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              currentDoc={activeDoc}
            />
          </div>
        )}
      </main>
    </div>
  );
}

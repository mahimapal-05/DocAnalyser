import React, { useState, useEffect, useRef } from 'react';
import AgentTimeline from './AgentTimeline';

export default function ChatBox({ messages, onSendMessage, isLoading, currentDoc }) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  const parseInlineStyles = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 4px; font-family: monospace; font-size: 0.85em;">$1</code>');
  };

  const renderMessageContent = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inList = false;
    let listItems = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        listItems.push(trimmed.substring(2));
      } else {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} style={{ margin: '0 0 12px 20px', paddingLeft: '0' }}>
              {listItems.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
              ))}
            </ul>
          );
          inList = false;
          listItems = [];
        }

        if (trimmed === "") return;

        if (trimmed.startsWith('>')) {
          elements.push(
            <blockquote key={index} style={{ borderLeft: '3px solid var(--theme-color)', paddingLeft: '12px', margin: '12px 0', fontStyle: 'italic', color: 'var(--text-muted)' }} dangerouslySetInnerHTML={{ __html: parseInlineStyles(trimmed.substring(1).trim()) }} />
          );
        } else {
          elements.push(
            <p key={index} style={{ marginBottom: '12px' }} dangerouslySetInnerHTML={{ __html: parseInlineStyles(trimmed) }} />
          );
        }
      }
    });

    if (inList) {
      elements.push(
        <ul key="ul-end" style={{ margin: '0 0 12px 20px', paddingLeft: '0' }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
          ))}
        </ul>
      );
    }

    return elements;
  };

  // Get quick prompts depending on document category
  const getQuickPrompts = () => {
    if (!currentDoc) return [];
    switch (currentDoc.category) {
      case 'medical':
        return [
          "Explain the diagnosis in simple terms",
          "What medications were prescribed and why?",
          "Are there any red flags or warnings?"
        ];
      case 'legal':
        return [
          "What are my termination obligations?",
          "Explain the liability limit clause",
          "What is the governing law of this contract?"
        ];
      case 'educational':
        return [
          "Summarize the core equations",
          "Explain Heisenberg Uncertainty Principle",
          "Create a study guide outline"
        ];
      default:
        return [
          "Summarize this document",
          "What are the main key points?",
          "Explain the primary entities mentioned"
        ];
    }
  };

  return (
    <div className="chat-panel">
      {/* Messages */}
      <div className="chat-history">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>Ask ClarityDoc Agent</div>
            <p style={{ maxWidth: '320px', fontSize: '0.85rem' }}>
              Inquire about risk details, clinical warnings, vocabulary definitions, or test summaries.
            </p>
            {currentDoc && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px', marginTop: '16px' }}>
                {getQuickPrompts().map((prompt, idx) => (
                  <button
                    key={idx}
                    className="quiz-option-btn"
                    onClick={() => onSendMessage(prompt)}
                    style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.role !== 'user' && <div className="message-avatar ai">AI</div>}
              
              <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%', gap: '4px' }}>
                <div className="message-bubble">
                  {renderMessageContent(msg.content)}
                </div>
                
                {msg.thought_process && msg.thought_process.length > 0 && (
                  <AgentTimeline thoughts={msg.thought_process} />
                )}
              </div>
              
              {msg.role === 'user' && <div className="message-avatar user">U</div>}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message-row ai">
            <div className="message-avatar ai">AI</div>
            <div className="message-bubble" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'var(--theme-color)' }}></div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            className="chat-input"
            placeholder={currentDoc ? "Ask a question about this document..." : "Upload a document to start chatting"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!currentDoc || isLoading}
          />
          <button type="submit" className="send-btn" disabled={!currentDoc || !input.trim() || isLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

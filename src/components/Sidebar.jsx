import React from 'react';

export default function Sidebar({ documents, activeDocId, onSelectDoc, onNewDoc, isOnline }) {
  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'medical': return '🩺';
      case 'legal': return '⚖️';
      case 'educational': return '📚';
      default: return '📄';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">C</div>
        <div className="logo-text">ClarityDoc AI</div>
      </div>

      <button className="new-btn" onClick={onNewDoc}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>New Analysis</span>
      </button>

      <div className="sidebar-menu">
        <div className="menu-label">Active Analysis</div>
        {documents.length === 0 ? (
          <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-dark)', textAlign: 'center' }}>
            No documents analyzed
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className={`doc-item ${doc.id === activeDocId ? 'active' : ''}`}
              onClick={() => onSelectDoc(doc.id)}
            >
              <div className="doc-item-icon" style={{ backgroundColor: `rgba(${doc.category === 'medical' ? '16, 185, 129' : doc.category === 'legal' ? '245, 158, 11' : doc.category === 'educational' ? '99, 102, 241' : '6, 180, 212'}, 0.15)` }}>
                {getCategoryEmoji(doc.category)}
              </div>
              <div className="doc-item-details">
                <div className="doc-item-name">{doc.filename}</div>
                <div className="doc-item-meta">
                  {doc.category.toUpperCase()} • {doc.profile.complexity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="api-badge">
          <div className={`badge-dot ${isOnline ? '' : 'offline'}`}></div>
          <span>Groq Agent Engine: {isOnline ? 'Active' : 'Offline Preview'}</span>
        </div>
      </div>
    </aside>
  );
}

import React from 'react';
import QuizModule from './QuizModule';

export default function DocInsights({ doc }) {
  if (!doc || !doc.profile) return null;

  const { profile } = doc;
  const category = profile.category || 'general';

  const getCategoryThemeClass = () => {
    switch (category) {
      case 'medical': return 'mode-medical';
      case 'legal': return 'mode-legal';
      case 'educational': return 'mode-educational';
      default: return 'mode-general';
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'medical': return '🩺 Medical Expert';
      case 'legal': return '⚖️ Legal Expert';
      case 'educational': return '📚 Education Expert';
      default: return '📄 General Document';
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'medical': return 'var(--color-medical)';
      case 'legal': return 'var(--color-legal)';
      case 'educational': return 'var(--color-educational)';
      default: return 'var(--color-general)';
    }
  };

  return (
    <div className={`insights-panel ${getCategoryThemeClass()}`}>
      {/* Header Info */}
      <div className="insights-header">
        <div className="insights-title-section">
          <div
            className="doc-badge"
            style={{
              color: getCategoryColor(),
              backgroundColor: `rgba(${category === 'medical' ? '16, 185, 129' : category === 'legal' ? '245, 158, 11' : category === 'educational' ? '99, 102, 241' : '6, 180, 212'}, 0.1)`,
              borderColor: `rgba(${category === 'medical' ? '16, 185, 129' : category === 'legal' ? '245, 158, 11' : category === 'educational' ? '99, 102, 241' : '6, 180, 212'}, 0.2)`
            }}
          >
            {getCategoryLabel()}
          </div>
          <h1 className="doc-title-h1" title={profile.title || doc.filename}>
            {profile.title || doc.filename}
          </h1>
        </div>
      </div>

      {/* Meta Stats */}
      <div className="insights-meta-stats">
        <div className="stat-card">
          <span className="stat-label">Estimated Reading Time</span>
          <span className="stat-value">{profile.estimated_reading_time || 1} min</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Document Complexity</span>
          <span className="stat-value" style={{ color: getCategoryColor() }}>
            {profile.complexity || 'Moderate'}
          </span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="insight-card">
        <h2 className="card-title-h2">📝 Agent Summary</h2>
        <p className="summary-text">{profile.summary}</p>
      </div>

      {/* Dynamic Medical Insights */}
      {category === 'medical' && profile.medical_meta && (
        <>
          {profile.medical_meta.patient_info && (
            <div className="insight-card">
              <h2 className="card-title-h2">👤 Patient Information</h2>
              <p className="summary-text" style={{ fontWeight: 600 }}>
                {profile.medical_meta.patient_info}
              </p>
            </div>
          )}

          <div className="insight-card">
            <h2 className="card-title-h2">🔬 Clinical Findings</h2>
            <ul className="meta-list">
              {profile.medical_meta.key_findings && profile.medical_meta.key_findings.map((finding, idx) => (
                <li key={idx} className="meta-list-item">{finding}</li>
              ))}
            </ul>
          </div>

          {profile.medical_meta.prescriptions && profile.medical_meta.prescriptions.length > 0 && (
            <div className="insight-card">
              <h2 className="card-title-h2">💊 Prescriptions & Advice</h2>
              <ul className="meta-list">
                {profile.medical_meta.prescriptions.map((prescription, idx) => (
                  <li key={idx} className="meta-list-item">{prescription}</li>
                ))}
              </ul>
            </div>
          )}

          {profile.medical_meta.critical_warnings && profile.medical_meta.critical_warnings.length > 0 && (
            <div className="insight-card warning-card">
              <h2 className="card-title-h2">⚠️ Critical Warnings</h2>
              <ul className="meta-list">
                {profile.medical_meta.critical_warnings.map((warning, idx) => (
                  <li key={idx} className="meta-list-item" style={{ color: '#ef4444', fontWeight: 500 }}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Dynamic Legal Insights */}
      {category === 'legal' && profile.legal_meta && (
        <>
          <div className="insight-card">
            <h2 className="card-title-h2">
              ⚖️ Risk Assessment
              <span className={`risk-badge risk-${profile.legal_meta.risk_level}`} style={{ marginLeft: 'auto' }}>
                {profile.legal_meta.risk_level} Risk
              </span>
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Involved Parties:</strong>
              <ul className="meta-list" style={{ marginTop: '6px' }}>
                {profile.legal_meta.parties && profile.legal_meta.parties.map((party, idx) => (
                  <li key={idx} className="meta-list-item">{party}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="insight-card">
            <h2 className="card-title-h2">📋 Essential Terms</h2>
            <ul className="meta-list">
              {profile.legal_meta.key_clauses && profile.legal_meta.key_clauses.map((clause, idx) => (
                <li key={idx} className="meta-list-item">{clause}</li>
              ))}
            </ul>
          </div>

          {profile.legal_meta.red_flags && profile.legal_meta.red_flags.length > 0 && (
            <div className="insight-card red-flag-card">
              <h2 className="card-title-h2">🚩 Red Flags & Liabilities</h2>
              <ul className="meta-list">
                {profile.legal_meta.red_flags.map((flag, idx) => (
                  <li key={idx} className="meta-list-item" style={{ color: '#fbbf24', fontWeight: 500 }}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Dynamic Educational Insights */}
      {category === 'educational' && profile.educational_meta && (
        <>
          <div className="insight-card">
            <h2 className="card-title-h2">📘 Syllabus Overview</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong>Subject:</strong> {profile.educational_meta.subject}
              <div style={{ marginTop: '8px' }}><strong>Learning Outcomes:</strong></div>
              <ul className="meta-list" style={{ marginTop: '4px' }}>
                {profile.educational_meta.learning_outcomes && profile.educational_meta.learning_outcomes.map((outcome, idx) => (
                  <li key={idx} className="meta-list-item">{outcome}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="insight-card">
            <h2 className="card-title-h2">🧠 Core Formulas & Concepts</h2>
            <ul className="meta-list">
              {profile.educational_meta.core_concepts && profile.educational_meta.core_concepts.map((concept, idx) => (
                <li key={idx} className="meta-list-item">{concept}</li>
              ))}
            </ul>
          </div>

          {profile.educational_meta.quiz_questions && profile.educational_meta.quiz_questions.length > 0 && (
            <div className="insight-card" style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}>
              <h2 className="card-title-h2" style={{ color: 'var(--color-educational)' }}>✍️ Active Recall Quiz</h2>
              <QuizModule questions={profile.educational_meta.quiz_questions} />
            </div>
          )}
        </>
      )}

      {/* Glossary (General & Categories fallback) */}
      {profile.key_entities && profile.key_entities.length > 0 && (
        <div className="insight-card">
          <h2 className="card-title-h2">🔍 Jargon Buster & Key Terms</h2>
          <div className="glossary-grid">
            {profile.key_entities.map((entity, idx) => (
              <div key={idx} className="glossary-item">
                <div className="glossary-name">{entity.name}</div>
                <div className="glossary-desc">{entity.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

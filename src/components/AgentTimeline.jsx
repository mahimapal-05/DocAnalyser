import React, { useState } from 'react';

export default function AgentTimeline({ thoughts }) {
  const [expanded, setExpanded] = useState(true);

  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="agent-log-container">
      <div className="agent-log-header" onClick={() => setExpanded(!expanded)}>
        <span>🤖 Agent thought log ({thoughts.length} steps)</span>
        <span style={{ fontSize: '0.65rem' }}>{expanded ? '▲ Hide' : '▼ Expand'}</span>
      </div>
      
      {expanded && (
        <div className="agent-log-steps">
          {thoughts.map((step, idx) => {
            // Pick a bullet emoji or icon based on the step text
            let bullet = "•";
            if (step.includes("🔍") || step.includes("🔎")) bullet = "🔍";
            else if (step.includes("🏷️")) bullet = "🏷️";
            else if (step.includes("🩺") || step.includes("MediSense")) bullet = "🩺";
            else if (step.includes("⚖️") || step.includes("LexGuard")) bullet = "⚖️";
            else if (step.includes("📚") || step.includes("EduScribe")) bullet = "📚";
            else if (step.includes("⚡")) bullet = "⚡";
            else if (step.includes("✅")) bullet = "✅";
            else if (step.includes("❌")) bullet = "❌";
            else if (step.includes("⚠️")) bullet = "⚠️";
            else if (step.includes("🤖")) bullet = "🤖";
            else if (step.includes("📝")) bullet = "📝";
            
            const textWithoutEmoji = step.replace(/^(🔍|🔎|🏷️|🩺|⚖️|📚|⚡|✅|❌|⚠️|🤖|📝)\s*/, "");

            return (
              <div key={idx} className="agent-step">
                <span className="agent-step-bullet">{bullet}</span>
                <span className="agent-step-text">{textWithoutEmoji}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

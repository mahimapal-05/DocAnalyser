import React, { useState } from 'react';

const SAMPLES = [
  {
    key: 'medical',
    category: 'medical',
    filename: 'Lab_Report_John_Doe_998.pdf',
    title: 'Diagnostic Lab Report: John Doe',
    desc: 'Medical lab diagnostics showing liver panels and cholesterol markers.',
    text: `CLINICAL DIAGNOSTICS LABS
PATIENT: John Doe
AGE: 47  GENDER: Male
DATE: July 12, 2026

METABOLIC AND LIVER FUNCTIONS REPORT

Triglycerides: 280 mg/dL (Reference Range: < 150 mg/dL) [HIGH]
Total Cholesterol: 245 mg/dL (Reference Range: < 200 mg/dL) [ELEVATED]
HDL Cholesterol: 38 mg/dL (Reference Range: > 40 mg/dL) [LOW]
LDL Cholesterol: 151 mg/dL (Reference Range: < 100 mg/dL) [HIGH]

LIVER ENZYMES:
Alanine Aminotransferase (ALT): 74 U/L (Reference Range: 7 - 56 U/L) [HIGH]
Aspartate Aminotransferase (AST): 61 U/L (Reference Range: 10 - 40 U/L) [HIGH]
Alkaline Phosphatase (ALP): 95 U/L (Reference Range: 44 - 147 U/L) [NORMAL]

RECOMMENDATION AND PRESCRIPTIONS:
Patient presents with mixed dyslipidemia and mild transaminitis.
1. Initiate Atorvastatin (Lipitor) 20mg daily at bedtime to manage high LDL.
2. Strict lifestyle modifications: Reduce saturated fat and alcohol intake. 
3. Re-evaluate serum liver panel (ALT/AST) in 6 weeks to monitor for drug-induced hepatotoxicity.

WARNING: If ALT/AST levels exceed 3x upper limit of normal (>168 U/L), hold Atorvastatin and contact physician. Patient must report immediate symptoms of unexplained muscle pain, dark urine, or abdominal tenderness.`,
    profile: {
      title: 'Diagnostic Lab Report: John Doe',
      category: 'medical',
      summary: 'A metabolic and liver function diagnostic lab report for a 47-year-old male patient showing elevated triglycerides, elevated cholesterol, and elevated liver enzymes (ALT/AST). The physician recommends initiating Lipitor 20mg daily along with strict dietary and alcohol reductions, with a scheduled liver enzyme check-up in 6 weeks.',
      complexity: 'Moderate',
      estimated_reading_time: 2,
      key_entities: [
        { name: 'Transaminitis', description: 'Elevated liver enzymes (ALT and AST) which usually indicates liver cell injury or inflammation.' },
        { name: 'Dyslipidemia', description: 'An abnormal amount of lipids (like cholesterol or fat) in the blood.' },
        { name: 'Atorvastatin (Lipitor)', description: 'A common statin medication used to lower bad cholesterol (LDL) and triglycerides.' },
        { name: 'Hepatotoxicity', description: 'Chemical-driven liver damage. Liver enzymes are monitored to ensure statins do not harm the liver.' }
      ],
      medical_meta: {
        patient_info: 'John Doe, 47-Year-Old Male',
        key_findings: [
          'High LDL (151 mg/dL) and Total Cholesterol (245 mg/dL)',
          'Elevated Triglycerides (280 mg/dL)',
          'High ALT (74 U/L) and AST (61 U/L) indicating active liver cell stress'
        ],
        prescriptions: [
          'Atorvastatin (Lipitor) 20mg once daily at bedtime',
          'Reduce dietary saturated fats',
          'Eliminate/Reduce alcohol consumption'
        ],
        critical_warnings: [
          'Monitor liver function panel again in 6 weeks',
          'Hold medication if liver enzymes rise to 3x normal (>168 U/L)',
          'Report immediately if experiencing unexplained muscle pain, dark urine, or yellow skin (jaundice)'
        ]
      }
    }
  },
  {
    key: 'legal',
    category: 'legal',
    filename: 'SaaS_Services_Agreement_Final.docx',
    title: 'SaaS Subscription Agreement',
    desc: 'B2B software-as-a-service terms covering renewals, IP, and liability.',
    text: `SOFTWARE-AS-A-SERVICE AGREEMENT
This SaaS Agreement ("Agreement") is made effective as of August 1, 2026, by and between TechFlow Solutions Corp ("Provider") and Vertex Enterprise Inc ("Client").

1. SERVICES AND LICENSES
Provider grants Client a non-exclusive, non-transferable license to access the TechFlow Cloud Dashboard during the Term.

2. FEES AND PAYMENTS
Client shall pay Provider an annual subscription fee of $45,000. All fees are non-refundable.

3. TERM AND AUTOMATIC RENEWAL
The initial term of this Agreement shall be twelve (12) months. THIS AGREEMENT SHALL AUTOMATICALLY RENEW FOR SUCCESSIVE 12-MONTH PERIODS UNLESS EITHER PARTY PROVIDES WRITTEN NOTICE OF TERMINATION AT LEAST NINETY (90) DAYS PRIOR TO THE EXPIRATION OF THE CURRENT TERM.

4. LIMITATION OF LIABILITY
IN NO EVENT SHALL PROVIDER'S TOTAL LIABILITY FOR ALL CLAIMS ARISING UNDER OR RELATED TO THIS AGREEMENT EXCEED TEN (10) TIMES THE TOTAL FEES PAID BY CLIENT IN THE TWELVE MONTHS PRECEDING THE INCIDENT.

5. INTELLECTUAL PROPERTY
Provider retains all right, title, and interest in and to the SaaS Platform, including all custom configurations, feedback, and analytical models developed using Client usage patterns.

6. GOVERNING LAW AND JURISDICTION
This Agreement is governed by the laws of the State of Delaware, without regard to conflict of laws principles. Any disputes shall be settled exclusively in the state or federal courts in Wilmington, Delaware. Client hereby waives any rights to participate in any class-action lawsuits.`,
    profile: {
      title: 'SaaS Subscription Agreement: TechFlow & Vertex',
      category: 'legal',
      summary: 'A standard software-as-a-service provider contract setting an annual fee of $45,000 for a 1-year subscription. It outlines intellectual property ownership, sets a high liability ceiling, dictates Delaware governing law, and binds the customer to automatic renewals and a class action waiver.',
      complexity: 'Complex',
      estimated_reading_time: 4,
      key_entities: [
        { name: 'SaaS Platform', description: 'Software-as-a-Service model where the software is hosted centrally and licensed via subscription.' },
        { name: '90-Day Renewal Deadline', description: 'The time window in which you must cancel the contract, or else you are locked in for another full year.' },
        { name: 'Governing Law', description: 'The specific legal jurisdiction (here, Delaware) that applies to resolving any dispute.' },
        { name: 'Class Action Waiver', description: 'An agreement where the buyer surrenders their right to join group lawsuits against the vendor.' }
      ],
      legal_meta: {
        parties: ['TechFlow Solutions Corp (Provider)', 'Vertex Enterprise Inc (Client)'],
        risk_level: 'High',
        key_clauses: [
          'Annual recurring fee: $45,000',
          'Automatic 1-year contract renewals',
          'Provider retains ownership of all platform metrics and analytical derivatives'
        ],
        red_flags: [
          'Automatic Renewal: Requires 90 days advance notice to cancel, or auto-extends for a whole year.',
          'High Liability Limit: Provider liability is capped at 10x the annual fee, shifting major risk to client.',
          'Class Action Waiver: Restricts client from collective litigation.'
        ]
      }
    }
  },
  {
    key: 'educational',
    category: 'educational',
    filename: 'Physics_Ch3_Quantum_Physics.txt',
    title: 'Lecture Notes: Quantum Mechanics',
    desc: 'Educational text covering wave-particle duality and the uncertainty principle.',
    text: `CHAPTER 3: INTRODUCTION TO QUANTUM PHENOMENA

3.1 WAVE-PARTICLE DUALITY
Historically, light was treated strictly as a wave (Maxwell) and electrons as particles. However, the photoelectric effect demonstrated by Einstein (1905) showed light behaves as discrete packets called photons. Conversely, de Broglie (1924) proposed that particles like electrons possess a wavelength given by:
λ = h / p
where h is Planck's constant (6.626 x 10^-34 J·s) and p is the momentum of the particle. This duality is central to understanding atomic scales.

3.2 HEISENBERG'S UNCERTAINTY PRINCIPLE
Formulated by Werner Heisenberg in 1927, this principle states that it is physically impossible to simultaneously measure both the exact position (x) and momentum (p) of a particle with absolute certainty. The mathematical inequality is expressed as:
Δx · Δp ≥ h-bar / 2
where Δx is position uncertainty, Δp is momentum uncertainty, and h-bar is h / 2π. This limits the predictability of quantum events and establishes wave functions as probability fields.

3.3 SCHRÖDINGER'S WAVE EQUATION
To describe the state of a quantum particle, Erwin Schrödinger developed the wave equation. The time-independent version is:
ĤΨ = EΨ
Here, Ĥ is the Hamiltonian operator (representing total energy), Ψ (psi) is the wave function, and E is the energy eigenvalue. The square of the wave function (|Ψ|^2) represents the probability density of finding a particle in a given region of space.`,
    profile: {
      title: 'Chapter 3: Introduction to Quantum Phenomena',
      category: 'educational',
      summary: 'Introductory physics lecture material introducing wave-particle duality (de Broglie wavelength formula), Heisenberg\'s Uncertainty Principle equation, and Erwin Schrödinger\'s wave function probability density equation. The text outlines the mathematical frameworks governing quantum states.',
      complexity: 'Complex',
      estimated_reading_time: 3,
      key_entities: [
        { name: 'Wave-Particle Duality', description: 'The concept that every particle or quantum entity may be described as either a particle or a wave.' },
        { name: 'Planck\'s Constant', description: 'A physical constant (h) representing the quantum of electromagnetic action.' },
        { name: 'Heisenberg Principle', description: 'A fundamental limit to the precision with which certain pairs of physical properties of a particle can be known.' },
        { name: 'Wave Function (Psi)', description: 'A mathematical description of the quantum state of an isolated quantum system.' }
      ],
      educational_meta: {
        subject: 'Quantum Physics',
        core_concepts: [
          'De Broglie wavelength: λ = h / p',
          'Heisenberg Uncertainty Principle: Δx · Δp ≥ h-bar / 2',
          'Schrödinger Wave Equation: ĤΨ = EΨ',
          'Probability density representation: |Ψ|^2'
        ],
        learning_outcomes: [
          'Explain Einstein\'s photon concept and de Broglie\'s particle wavelength',
          'Understand position-momentum measurement limits',
          'Define the physical meaning of the wave function psi'
        ],
        quiz_questions: [
          {
            question: "Who proposed that particles like electrons possess wave-like wavelengths?",
            options: ["Albert Einstein", "Louis de Broglie", "Werner Heisenberg", "Erwin Schrödinger"],
            correct_answer: "Louis de Broglie"
          },
          {
            question: "What does the square of the wave function (|Ψ|^2) represent?",
            options: ["Total energy of the particle", "Position-momentum uncertainty ratio", "Probability density of finding a particle", "The wavelength of a photon"],
            correct_answer: "Probability density of finding a particle"
          },
          {
            question: "What is the formula for the de Broglie wavelength?",
            options: ["λ = h / p", "Δx · Δp ≥ h-bar / 2", "ĤΨ = EΨ", "E = mc^2"],
            correct_answer: "λ = h / p"
          }
        ]
      }
    }
  }
];

export default function UploadZone({ onUploadSuccess, onLoading, isLoading }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    onLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to process document");
      }

      const data = await response.json();
      onUploadSuccess({
        id: data.doc_id,
        filename: data.filename,
        text: data.char_count > 0 ? "" : "", // Backend caches full text; we store reference or pass it.
        category: data.profile.category,
        profile: data.profile
      });
    } catch (error) {
      alert(`Error: ${error.message}. Switching to local mock profiling.`);
      // If server is failing, let's auto-fallback to general mock parsing to keep the app working
      simulateMock(file.name);
    }
  };

  const simulateMock = (filename) => {
    // Generate simple mock profile based on extension/name
    const nameLower = filename.toLowerCase();
    let selectedSample = SAMPLES[2]; // Default to general education
    if (nameLower.includes('med') || nameLower.includes('lab') || nameLower.includes('doctor') || nameLower.includes('patient')) {
      selectedSample = SAMPLES[0];
    } else if (nameLower.includes('contract') || nameLower.includes('agree') || nameLower.includes('term') || nameLower.includes('policy')) {
      selectedSample = SAMPLES[1];
    }

    setTimeout(() => {
      onUploadSuccess({
        id: `mock-${Date.now()}`,
        filename: filename,
        text: selectedSample.text,
        category: selectedSample.category,
        profile: {
          ...selectedSample.profile,
          title: filename.rsplit ? filename.rsplit('.', 1)[0].replace(/_|-/g, ' ').title() : filename
        }
      });
    }, 1500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectSample = (sample) => {
    onLoading(true);
    setTimeout(() => {
      onUploadSuccess({
        id: `sample-${sample.key}`,
        filename: sample.filename,
        text: sample.text,
        category: sample.category,
        profile: sample.profile
      });
    }, 1200);
  };

  return (
    <div className="upload-container">
      {isLoading ? (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
            🤖 Agent profiling in progress... Classifying domain & extracting parameters
          </div>
        </div>
      ) : (
        <>
          <h1 className="welcome-title">Simplify Complex Documents</h1>
          <p className="welcome-sub">
            AI-powered agentic workflows specialized in parsing, summarizing, and dissecting medical reports, legal agreements, and course textbooks.
          </p>

          <div
            className={`dropzone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-picker').click()}
          >
            <input
              type="file"
              id="file-picker"
              style={{ display: 'none' }}
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={handleFileChange}
            />
            <div className="upload-icon">📁</div>
            <div className="upload-text">Drag & drop your document here</div>
            <div className="upload-hint">Supports PDF, DOCX, TXT (Max 15MB)</div>
          </div>

          <div className="samples-section">
            <div className="samples-title">Or test with premium samples</div>
            <div className="samples-grid">
              {SAMPLES.map((sample) => (
                <div
                  key={sample.key}
                  className="sample-card"
                  onClick={() => selectSample(sample)}
                  style={{ '--theme-color': sample.category === 'medical' ? 'var(--color-medical)' : sample.category === 'legal' ? 'var(--color-legal)' : 'var(--color-educational)', '--theme-glow': sample.category === 'medical' ? 'var(--glow-medical)' : sample.category === 'legal' ? 'var(--glow-legal)' : 'var(--glow-educational)' }}
                >
                  <div className="sample-type" style={{ color: sample.category === 'medical' ? 'var(--color-medical)' : sample.category === 'legal' ? 'var(--color-legal)' : 'var(--color-educational)' }}>
                    {sample.category}
                  </div>
                  <div className="sample-title">{sample.title}</div>
                  <div className="sample-desc">{sample.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

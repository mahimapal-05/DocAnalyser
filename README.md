# ClarityDoc AI 🤖📄

ClarityDoc AI is a premium, agentic document analyzer chatbot built with a FastAPI backend and a React (Vite) frontend. It is designed to ingest complex PDF, DOCX, and TXT documents, automatically classify their domain (Medical, Legal, Educational, or General), extract rich structured metadata, and host specialized conversational agents.

It is designed to be easily and cheaply deployed on **Render** as a single combined service.

---

## Key Features

1. **Agentic Router**: Automatically profiles document type, calculates complexity, estimated reading time, and extracts a glossary of jargon.
2. **Specialist AI Agents**:
   - 🩺 **MediSense**: Translates medical charts, tests, and prescriptions into layperson terms with warning disclaimers.
   - ⚖️ **LexGuard**: Dissects contracts, extracts risk levels, flags unfavorable clauses (e.g. strict auto-renewals, waivers), and highlights key terms.
   - 📚 **EduScribe**: Synthesizes textbook concepts, explains mathematical equations, and builds interactive study quizzes.
3. **Interactive UI**: ChatGPT-style conversational design featuring frosted-glass elements, neon theme adaptations, and an **Agent thought process logger** showing real-time execution steps.
4. **Offline Mode / Samples**: Interactive mock documents allow immediate trial and testing even if the `GROQ_API_KEY` is not configured.

---

## Technology Stack

- **Backend**: FastAPI, Python, Uvicorn, Groq SDK (`llama-3.3-70b-versatile`), `pypdf`, `python-docx`
- **Frontend**: React.js, Vite, Premium Vanilla CSS (ChatGPT inspired, fully responsive, glassmorphic layout)
- **Deployment**: Render Blueprint (`render.yaml`)

---

## Local Setup

### Prerequisites

- Node.js (v18+) and npm
- Python (3.9+)

### Installation

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Configure your Groq API Key in the backend:
   Create a `.env` file inside the `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Run the development server (runs FastAPI backend on port 8000 and Vite frontend on port 5173 with proxying):
   ```bash
   npm run dev-all
   ```
   Open your browser to `http://localhost:5173` to interact with the app.

---

## Render Deployment

To deploy on Render:

1. **Push your code to GitHub**.
2. **Create a new Blueprint Web Service** on Render:
   - Go to your Render dashboard and click **New > Blueprint**.
   - Connect your GitHub repository.
   - Render will detect the `render.yaml` blueprint configuration and list the service `claritydoc-ai`.
3. **Environment Variable**:
   - Render will prompt you for the environment variables defined in `render.yaml`.
   - Set the `GROQ_API_KEY` environment variable with your Groq API Key (from the Groq Console).
4. **Deploy**!
   - Render will build the React assets, install the Python backend dependencies, and start the FastAPI server under a single URL.
   - You can monitor the deployment logs on your Render dashboard.

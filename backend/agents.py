import os
import json
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Gemini Client if API key is present
def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        return genai.Client(api_key=api_key)
    except Exception:
        return None

# Pydantic Schemas for Structured Metadata Extraction
class KeyEntity(BaseModel):
    name: str = Field(description="Name of the key term, drug, party, concept, etc.")
    description: str = Field(description="Brief explanation of what it is in the context of the document.")

class LegalMetadata(BaseModel):
    parties: List[str] = Field(default_factory=list, description="Parties involved in the contract or agreement.")
    risk_level: str = Field(default="Low", description="Risk level: Low, Medium, High.")
    key_clauses: List[str] = Field(default_factory=list, description="List of key clauses (e.g., termination, liability, indemnification).")
    red_flags: List[str] = Field(default_factory=list, description="Potentially unfavorable terms or hidden clauses.")

class MedicalMetadata(BaseModel):
    patient_info: Optional[str] = Field(None, description="Patient name, age, gender if mentioned.")
    key_findings: List[str] = Field(default_factory=list, description="Key medical findings, diagnoses, or test results.")
    prescriptions: List[str] = Field(default_factory=list, description="Medications, dosages, or advice mentioned.")
    critical_warnings: List[str] = Field(default_factory=list, description="Warnings or findings that require immediate attention.")

class QuizQuestion(BaseModel):
    question: str = Field(description="The multiple choice question based on the text.")
    options: List[str] = Field(description="List of 4 plausible choices/options.")
    correct_answer: str = Field(description="The exact correct answer (must match one of the options).")

class EducationalMetadata(BaseModel):
    subject: str = Field(default="General", description="Subject matter (e.g. Physics, History, Medicine, Law).")
    core_concepts: List[str] = Field(default_factory=list, description="Key concepts or formulas explained in the text.")
    learning_outcomes: List[str] = Field(default_factory=list, description="What the reader will learn from this text.")
    quiz_questions: List[QuizQuestion] = Field(default_factory=list, description="Generate 3-5 multiple choice questions based on the text.")

class DocumentProfile(BaseModel):
    title: str = Field(description="A suitable title for the document.")
    category: str = Field(description="The domain category: 'medical', 'legal', 'educational', or 'general'.")
    summary: str = Field(description="A concise 3-4 sentence summary of the document.")
    complexity: str = Field(description="Readability/Complexity: 'Simple', 'Moderate', or 'Complex'.")
    estimated_reading_time: int = Field(description="Estimated reading time in minutes.")
    key_entities: List[KeyEntity] = Field(description="Important concepts, medical terms, legal parties, or educational terms.")
    legal_meta: Optional[LegalMetadata] = None
    medical_meta: Optional[MedicalMetadata] = None
    educational_meta: Optional[EducationalMetadata] = None

# Fallback profile if Gemini is unavailable
def get_fallback_profile(filename: str, text: str) -> Dict[str, Any]:
    text_len = len(text)
    est_reading = max(1, text_len // 1000)
    
    # Infer simple category from file content/name
    category = "general"
    content_lower = text.lower() + " " + filename.lower()
    
    if any(k in content_lower for k in ["medical", "doctor", "health", "patient", "clinical", "hospital", "drug", "prescription"]):
        category = "medical"
    elif any(k in content_lower for k in ["agreement", "contract", "legal", "liability", "clause", "indemnity", "party", "hereby"]):
        category = "legal"
    elif any(k in content_lower for k in ["education", "student", "class", "course", "lesson", "chapter", "theory", "formula"]):
        category = "educational"
        
    return {
        "title": filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title(),
        "category": category,
        "summary": "This is a placeholder summary generated locally. To see the full agentic analysis, please configure your GEMINI_API_KEY in the backend.",
        "complexity": "Moderate",
        "estimated_reading_time": est_reading,
        "key_entities": [
            {"name": "Local Parser", "description": "Successfully parsed text locally, but AI analysis is pending API key configuration."}
        ],
        "legal_meta": {
            "parties": ["Unknown Parties"],
            "risk_level": "Medium",
            "key_clauses": ["N/A"],
            "red_flags": ["Missing GEMINI_API_KEY configuration"]
        } if category == "legal" else None,
        "medical_meta": {
            "patient_info": "Unknown Patient",
            "key_findings": ["Failed to extract clinical insights (API key missing)"],
            "prescriptions": [],
            "critical_warnings": ["Please configure your GEMINI_API_KEY in backend/.env"]
        } if category == "medical" else None,
        "educational_meta": {
            "subject": "General",
            "core_concepts": ["Text Parsing"],
            "learning_outcomes": ["Document text extracted successfully"],
            "quiz_questions": [
                {
                    "question": "What is required to unlock full AI Agent capabilities in this app?",
                    "options": [
                        "Nothing, it is already fully functional",
                        "Setting GEMINI_API_KEY in the environment or backend/.env file",
                        "A subscription payment",
                        "Restarting the computer"
                    ],
                    "correct_answer": "Setting GEMINI_API_KEY in the environment or backend/.env file"
                }
            ]
        } if category == "educational" else None
    }

def analyze_document_profile(filename: str, doc_text: str) -> Dict[str, Any]:
    """
    Analyzes document using Router/Profiler Agent.
    Categorizes, summarizes, and extracts domain-specific metadata.
    """
    client = get_gemini_client()
    if not client:
        return get_fallback_profile(filename, doc_text)
        
    # Limit text length to prevent context explosion on massive uploads
    sample_text = doc_text[:12000] # ~3000 tokens of sample text is sufficient for classification and profiling
    
    prompt = f"""
    You are ClarityDoc Profiling Agent. 
    Analyze the following document text and build a complete document profile.
    
    File Name: {filename}
    Document Text (Snippet):
    ---
    {sample_text}
    ---
    
    Tasks:
    1. Classify the document category as 'medical', 'legal', 'educational', or 'general'.
       - 'medical': Medical records, prescription lists, doctor notes, health summaries, lab reports.
       - 'legal': Contracts, NDA, terms of service, leases, policies, court records.
       - 'educational': Research papers, study materials, textbooks, course outlines, lecture notes.
       - 'general': Any general document that doesn't fit the above.
    2. Write a 3-4 sentence concise summary explaining what the document is, its author/origin if visible, and its core purpose.
    3. Determine the complexity (Simple, Moderate, Complex) and estimate the reading time (in minutes).
    4. Extract key entities: 3-6 important terms, names, abbreviations, or concept headings and define them in standard layman words based on context.
    5. Populate the category-specific metadata blocks depending on the classified category:
       - If legal, extract the parties, assess overall Risk Level (Low/Medium/High), extract 3-5 key clause themes, and list any potential 'red flags' (e.g., hidden liabilities, strict termination, auto-renewal).
       - If medical, extract patient information, key medical findings/lab results, prescriptions, and any critical health warnings.
       - If educational, determine the subject, list core concepts, learning outcomes, and generate 3 multiple-choice study quiz questions.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=DocumentProfile,
                temperature=0.2
            )
        )
        profile_json = json.loads(response.text)
        return profile_json
    except Exception as e:
        print(f"Error in analyze_document_profile: {e}")
        return get_fallback_profile(filename, doc_text)

def answer_document_query(
    doc_text: str,
    category: str,
    chat_history: List[Dict[str, str]],
    user_query: str
) -> Dict[str, Any]:
    """
    Orchestrates the conversation with domain-specific agent directives.
    Returns the agent's response and a breakdown of their thought process.
    """
    client = get_gemini_client()
    if not client:
        return {
            "answer": "I'm in offline preview mode because no `GEMINI_API_KEY` was found. Please add a valid API key to backend/.env or server environment to enable active conversations.",
            "thought_process": [
                "🔍 Received user query",
                "⚠️ Checked GEMINI_API_KEY configuration",
                "❌ API Key not found",
                "🔄 Responded with offline alert"
            ]
        }
        
    # Construct Agent Thought Process Log based on routing
    thoughts = []
    thoughts.append(f"🔍 Analyzing user intent: '{user_query[:50]}...'")
    thoughts.append(f"🏷️ Routing context to specialist category: [{category.upper()}]")
    
    # Establish system instructions based on the specialist agent
    if category == "medical":
        system_instruction = """
        You are MediSense, a highly empathetic and precise medical AI Specialist.
        Your goal is to answer questions about the provided medical document and simplify complex medical terms.
        
        Guidelines:
        1. Always explain medical terms (like symptoms, lab values, or drug names) in simple, patient-friendly language.
        2. Point out specific parts of the document that relate to their question.
        3. Maintain a supportive, professional, and clear tone.
        4. CRITICAL: Always append a standard disclaimer at the bottom of your response in italics stating:
           "Disclaimer: This analysis is for educational purposes only. Please consult a qualified healthcare provider for any medical decisions or concerns."
        """
        thoughts.append("🩺 Invoking MediSense Agent for clinical translation")
    elif category == "legal":
        system_instruction = """
        You are LexGuard, an analytical and highly detailed legal contract specialist.
        Your goal is to answer queries about the document and help translate legal jargon.
        
        Guidelines:
        1. Identify any potential risk factors, liabilities, obligations, and rights related to the user's query.
        2. Translate legalese into direct, plain English.
        3. Highlight key dates, dollar values, or termination conditions.
        4. Refer to section names or paragraph concepts when answering.
        """
        thoughts.append("⚖️ Invoking LexGuard Agent for risk assessment and contract review")
    elif category == "educational":
        system_instruction = """
        You are EduScribe, an engaging, pedagogical educational study coach.
        Your goal is to explain concepts, clarify text passages, and teach the user about the document content.
        
        Guidelines:
        1. Break down complex theories or technical steps into structured, bulleted lists or easy analogies.
        2. Encourage active learning: ask a follow-up question at the end to check understanding, or suggest creating a practice question.
        3. Provide helpful equations, vocabulary, or summaries if relevant.
        """
        thoughts.append("📚 Invoking EduScribe Agent for concept analysis and tutoring")
    else:
        system_instruction = """
        You are ClarityDoc General Agent, a versatile document companion.
        Answer the user's questions clearly, referencing the provided document content accurately.
        """
        thoughts.append("🤖 Invoking General Analysis Agent for document response")

    # Construct the contents structure with document context and history
    contents = []
    
    # Append the Document Context
    contents.append(types.Content(
        role="user",
        parts=[types.Part.from_text(
            text=f"Here is the document context we are discussing:\n\n=== DOCUMENT CONTENT ===\n{doc_text[:30000]}\n=== END OF DOCUMENT ===\n\nPlease use this context to answer my questions."
        )]
    ))
    
    # Append conversation history
    for msg in chat_history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(
            role=role,
            parts=[types.Part.from_text(text=msg["content"])]
        ))
        
    # Append current user query
    contents.append(types.Content(
        role="user",
        parts=[types.Part.from_text(text=user_query)]
    ))
    
    thoughts.append("📝 Formulating response context and matching history")
    thoughts.append("⚡ Sending request to Gemini LLM Engine...")
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.4
            )
        )
        thoughts.append("✅ Response successfully compiled and formatted")
        return {
            "answer": response.text,
            "thought_process": thoughts
        }
    except Exception as e:
        thoughts.append(f"❌ Error during generation: {str(e)}")
        return {
            "answer": f"An error occurred while getting an answer: {str(e)}",
            "thought_process": thoughts
        }

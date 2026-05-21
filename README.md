# HeartFlow

HeartFlow is an experimental multi-agent AI system that orchestrates personalised dating experiences end-to-end.

Instead of generating generic pickup lines, HeartFlow analyzes conversational dynamics, evaluates emotional engagement, and autonomously creates personalized invitation websites tailored to shared interests and conversation context.

Built to explore the difference between:

* “Vibe Coding”
  vs.
* true Agentic Engineering

---

# Features

* Multi-agent orchestration using LangGraph
* Sentiment + engagement analysis
* Interest extraction from conversation history
* Deterministic invite-readiness routing
* AI-generated personalized date invitations
* Autonomous Next.js website generation
* One-command deployment flow

---

# Architecture

```txt
Conversation Input
        ↓
Sentiment Agent
        ↓
Interest Extraction
        ↓
Orchestrator Agent
        ↓
Invite Generator
        ↓
Next.js Site Builder
        ↓
Deployment Agent
```

---

# Tech Stack

## AI / Agents

* LangGraph
* LangChain
* OpenAI API

## Backend

* Python
* FastAPI

## Frontend

* Next.js 15
* TailwindCSS
* shadcn/ui

## Deployment

* Vercel

---

# Example Workflow

1. User uploads or pastes a conversation
2. Agents analyze:

   * engagement
   * trust
   * interests
3. Orchestrator determines invite readiness
4. AI generates a personalized date concept
5. System builds and deploys a custom invite website
6. User receives a live shareable link

---

# Example Output

```json
{
  "engagement_score": 0.82,
  "trust_score": 0.74,
  "interests": [
    "jazz",
    "coffee",
    "modern art"
  ],
  "invite_ready": true
}
```

---

# Repository Structure

```txt
/backend
  /agents
  /graphs
  /prompts
  /tools

/frontend
  /app
  /components
```

---

# Running Locally

## Backend

```bash
cd backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Vision

HeartFlow is an exploration of agentic software systems:

* stateful AI orchestration
* autonomous tool execution
* memory-aware workflows
* AI-generated artifacts
* real-world execution pipelines

The goal is not to build “another chatbot.”

The goal is to explore AI as:

* an orchestration layer
* a reasoning engine
* autonomous middleware for real-world actions

---

# Disclaimer

This project is experimental and intended for educational/research purposes.

The system should prioritize:

* consent
* transparency
* respectful interactions
* non-manipulative behavior
* user safety

---

# License

MIT

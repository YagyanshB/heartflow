#!/bin/bash
set -e

echo "🪄 Starting HeartFlow Wingman..."

# Backend
echo ""
echo "Starting backend..."
cd backend
if [ ! -d "venv" ]; then
  python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt -q
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "⚠️  Created backend/.env — add your ANTHROPIC_API_KEY"
fi
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "  Backend running at http://localhost:8000 (PID $BACKEND_PID)"

# Frontend
echo ""
echo "Starting frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
  npm install
fi
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev &
FRONTEND_PID=$!
echo "  Frontend running at http://localhost:3000 (PID $FRONTEND_PID)"

echo ""
echo "✅ HeartFlow is running!"
echo "   Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop both servers"

wait

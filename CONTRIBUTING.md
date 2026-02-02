# Contributing to SignCast

## Quick Setup

### Prerequisites

- Python 3.11+
- Node.js 18+

### Windows

```powershell
git clone https://github.com/your-org/SignCast.git
cd SignCast
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\start_app.ps1
# Open http://localhost:5173
```

### Linux/Mac

```bash
git clone https://github.com/your-org/SignCast.git
cd SignCast
./scripts/start_app.sh
# Open http://localhost:5173
```

## Manual Setup

### Backend

```bash
cd apps/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run_backend.py
```

### Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Required
VITE_BACKEND_URL=http://127.0.0.1:8000

# Optional (for text simplification)
GROQ_API_KEY=your_key_here
```

## Development Guidelines

### Code Style

- **Python**: Follow PEP 8, use type hints
- **TypeScript**: Use TypeScript for all new code
- **React**: Functional components with hooks

### Making Changes

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test
4. Commit: `git commit -m "Add: your feature"`
5. Push and create Pull Request

### Commit Messages

- `Add: new feature`
- `Fix: bug description`
- `Update: changes to existing feature`

## Testing

```bash
# Backend
cd apps/backend && python -m pytest

# Frontend
cd apps/frontend && npm run build
```

## Common Issues

### Backend

- **Module not found**: Activate virtual environment
- **Port in use**: Kill process on port 8000
- **Model download**: First run downloads ~280MB

### Frontend

- **Build errors**: Clear `node_modules` and reinstall
- **CORS errors**: Check backend is running on port 8000

## Project Structure

```
SignCast/
├── apps/
│   ├── backend/     # FastAPI backend
│   └── frontend/    # React frontend
├── scripts/         # Build scripts
└── .env.example     # Environment template
```

## Need Help?

- Create an issue for bugs
- Use discussions for questions
- Check existing documentation

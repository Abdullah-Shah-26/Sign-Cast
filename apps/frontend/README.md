# SignBridge Frontend (React + TypeScript + Vite)

This frontend is a web app built with React, TypeScript, and Vite.

---

## 🚀 Getting Started

### 1. **Backend Requirement**

- **You must have the backend server running** for the app to function.
- See the backend's `README.md` for setup and run instructions.
- _Tip: In the future, the backend and frontend will be bundled together for a seamless experience. For now, you must run the backend manually._

### 2. **Environment Configuration**

The frontend uses environment variables for configuration. Copy `env.example` to `.env` and configure the following:

#### Required Environment Variables

```bash
# Backend API Configuration
VITE_BACKEND_URL=http://127.0.0.1:8000

# Feature Flags
VITE_ENABLE_TEXT_SIMPLIFICATION=true
VITE_ENABLE_POSE_GENERATION=true
VITE_ENABLE_SYSTEM_AUDIO=true

# UI Configuration
VITE_DEFAULT_SIGN_SIZE=24
VITE_MAX_RECORDING_TIME=300
VITE_ANIMATION_FPS=30

# Development Configuration
VITE_DEBUG=true
VITE_LOG_LEVEL=info
```

#### Setup Environment

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Edit `.env` and configure:
   - `VITE_BACKEND_URL`: URL of your backend server
   - Feature flags to enable/disable functionality
   - UI settings for sign size, recording limits, etc.

---

## 🌐 Running in the Browser (Web Only)

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the backend:**
   - See apps/backend/README.md for details.
3. **Run the frontend in dev mode:**

   ```sh
   npm run dev
   ```

   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

---

## ⚙️ Configuration

The frontend uses a centralized configuration system in `src/config.ts` that loads all settings from environment variables. This makes it easy to:

- Configure backend API endpoints
- Enable/disable features via feature flags
- Adjust UI settings like sign sizes and recording limits
- Control development settings and logging

### API Endpoints

The configuration automatically generates API endpoints based on the backend URL:

- `TRANSCRIBE`: `${BACKEND_URL}/transcribe`
- `SIMPLIFY_TEXT`: `${BACKEND_URL}/simplify_text`
- `TRANSLATE_SIGNWRITING`: `${BACKEND_URL}/translate_signwriting`
- `GENERATE_POSE`: `${BACKEND_URL}/generate_pose`

---

## ⚠️ Notes

- The backend **must** be running at the configured URL for the app to function.

---

## 🛠️ Development

- Lint: `npm run lint`
- Build: `npm run build`
- Preview production build: `npm run preview`

---

## 📦 Project Structure

- `src/` - React app source code
- `src/config.ts` - Configuration and environment variables
- `dist/` - Production build output (from Vite)

---

## 📚 References

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

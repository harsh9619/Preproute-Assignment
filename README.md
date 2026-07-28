

## ⚙️ Project Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_API_URL=/api
VITE_API_TARGET_URL=API_URL
```

### 4. Local Development Server
Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to the local URL (usually `http://localhost:5173`).

### 5. Production Compilation
Bundle the application for production deployment:
```bash
npm run build
```
This builds the production-ready assets inside the `dist/` directory.
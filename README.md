# Minimal React TypeScript Vite App

A minimal React application using TypeScript and Vite with CSS modules.

## Features

- ⚛️ React 18
- 🔷 TypeScript
- ⚡ Vite for fast bundling and development
- 🎨 CSS Modules for scoped styling
- 📦 Minimal dependencies

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:

   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
├── index.html          # Minimal HTML wrapper
├── src/
│   ├── App.tsx         # Main App component
│   ├── App.module.css  # CSS modules for App component
│   ├── main.tsx        # Entry point
│   └── vite-env.d.ts   # Type definitions
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

The app displays "Hello world" using a React component with CSS modules for styling.

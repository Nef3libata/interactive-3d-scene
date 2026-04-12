# Interactive 3D Scene Viewer

A web-based 3D viewer that loads an STL model and lets users add colored spheres of varying sizes into the scene, with intuitive camera navigation.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Features

- **STL Model Rendering** — Loads and displays a 3D STL model on a professional grid
- **Add Spheres** — Insert balls with 12 color presets and adjustable size (1–10)
- **3D Navigation** — Orbit (left-click), zoom (scroll), pan (right-click)
- **View Presets** — Top, Front, Side, and Reset camera positions
- **Focus on Ball** — Click any ball in the list to fly the camera to it
- **Scene Management** — Toggle visibility, delete individual balls, or clear all

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Three.js** + **React Three Fiber** + **Drei** — 3D rendering
- **Zustand** — State management
- **Vite** — Build tool
- **SCSS** — Styling

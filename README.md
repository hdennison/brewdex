# Brewdex Web App

A real-time, modular web application built with Vite, TypeScript, and a custom JSX renderer. This project demonstrates a reactive component system (no React), real‑time notifications via WebSocket, and comprehensive unit tests using Vitest and Testing Library.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)

  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Building for Production](#building-for-production)

- [Testing](#testing)
- [License](#license)

---

## Features

- **Custom Reactive Renderer**: Lightweight, React‑like API without React.
- **Real‑Time Notifications**: WebSocket‑powered notification system.
- **Modular Architecture**: Encapsulated modules and stores.
- **CSS Modules**: Scoped, maintainable styling.
- **Comprehensive Tests**: Vitest + Testing Library + Fishery factories.
- **Type‑Safe**: End‑to‑end TypeScript support.

---

## Tech Stack

- **[Vite](https://vitejs.dev/)** for fast bundling and dev server
- **TypeScript** for static typing
- **Custom JSX Renderer** in `@/lib/reactive-component`
- **Vitest** & **@testing-library/dom** for unit and integration tests
- **Fishery** for data factories in tests

---

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:3000` to see the app.

### Building for Production

```bash
npm run build
```

The production-ready files are generated in the `dist/` directory.

---

## Testing

Run the full test suite:

```bash
npm run test
```

This executes all Vitest specs, including:

- Component unit tests (`.unit.tsx`)
- Integration tests for notifications
- Factory‑driven tests using `fishery`

To watch tests interactively:

```bash
npm run test:watch
```

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
- **Comprehensive Tests**: Vitest + Testing Library + Fishery factories. Playwright for end‑to‑end tests (E2E).
- **Type‑Safe**: End‑to‑end TypeScript support.

---

## Tech Stack

- **[Vite](https://vitejs.dev/)** for fast bundling and dev server.
- **TypeScript** for static typing.
- **Custom JSX Renderer** in `@/lib/reactive-component`, no React.
- **Vitest** & **@testing-library/dom** for unit and integration tests.
- **Fishery** for data factories in tests.
- **Playwright** for end-to-end tests.

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

> **Disclaimer**  
> Even the build process will work, the output files cannot be used in production as I'm using hardcoded URLs for the BE server.

---

## Testing

Run the full unit/integration test suite:

```bash
npm run test:run
```

This executes all Vitest specs, including:

- Component unit tests
- Integration tests
- Factory‑driven tests using `fishery`

To watch tests interactively:

```bash
npm run test:watch
```

---

Run E2E tests

Make sure your Vite server is running on the default `http://localhost:5173/`

```bash
npm run test:e2e
```

This executes E2E tests in headless Chrome

If you want to see the tests run in a browser, run:

```bash
npm run test:e2e --ui
```

> **Disclaimer**  
> Notifications functionality is not E2E tested, as I need to mock the WS server.  
> In theory, this can be done with Mock Service Worker (MSW), but I didn't have time to do it.

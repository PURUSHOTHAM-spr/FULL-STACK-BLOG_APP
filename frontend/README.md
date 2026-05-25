# Blog Application Frontend

This directory contains the React (Vite-powered) client application for the Full-Stack Blog Application.

## Main Project Documentation

For a complete guide, setup instructions, APIs, and the backend overview, please refer to the main project README at:
**[Root README.md](../README.md)**

## Tech Stack & Structure

- **Framework**: React + Vite (Fast Refresh / HMR)
- **State Management**: Zustand (`src/store/AuthStore.js`)
- **Routing**: React Router (`src/App.jsx` with route guards in `src/components/ProtectedRoute.jsx`)
- **Styles**: Vanilla CSS under `src/styles/` and `src/components/`

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

// src/Main.jsx - Minimal JSX test
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return <h1>MINIMAL JSX TEST</h1>;
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
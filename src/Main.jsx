// src/Main.jsx - Alternative approach
import { createRoot } from 'react-dom/client';

function App() {
  return 'TEST WORKS';
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(App());
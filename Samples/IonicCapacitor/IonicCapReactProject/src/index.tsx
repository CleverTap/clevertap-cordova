import React from 'react';
import { createRoot } from 'react-dom/client';
import { setupIonicReact } from '@ionic/react';
import App from './App';
import '@ionic/react/css/core.css';

setupIonicReact();

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

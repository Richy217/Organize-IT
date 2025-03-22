// Alter Code von React 17 rendering mode zu Sicherheit noch drin gelassen

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// ReactDOM.render(<App />, document.getElementById('root'));

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
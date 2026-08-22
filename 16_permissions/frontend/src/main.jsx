import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import { Cartprovider } from './user/context/Cartcontext';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Cartprovider>
    <App />
    </Cartprovider>
    </BrowserRouter>
  </StrictMode>,
)

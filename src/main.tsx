import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import './index.css';
import App from './App.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, Component: App },
      { path: 'auth', element: <div>Auth Page goes here!</div> },
      { path: 'artist/:artistId', element: <div>Artist Page goes here!</div> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, redirect } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import './index.css';
import App from './App.tsx';
import './lib/spotifyApi.ts';
import AuthPage from './auth/AuthPage.tsx';
import { isAuthenticated } from './lib/spotifyApi.ts';

async function authMiddleware() {
  if (!isAuthenticated()) {
    throw redirect('/spotify-api-test/auth');
  }
}

const router = createBrowserRouter([
  {
    path: 'spotify-api-test',
    children: [
      { index: true, Component: App, middleware: [authMiddleware] },
      { path: 'auth', Component: AuthPage },
      { path: 'artist/:artistId', element: <div>Artist Page goes here!</div> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);

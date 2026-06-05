import { useEffect, useState } from 'react';
import { authenticate, getToken } from '../lib/spotifyApi';
import { useNavigate } from 'react-router';

function useSpotifyRedirectGetToken() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function tryGetToken() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error !== null) {
        return Promise.reject(error);
      }

      if (!code) {
        return Promise.reject();
      }

      return getToken(code);
    }

    tryGetToken()
      .then(() => {
        navigate('/');
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  return {
    isLoading,
  };
}

export default function AuthPage() {
  const { isLoading } = useSpotifyRedirectGetToken();

  return (
    <>
      <button
        onClick={() => {
          authenticate();
        }}
        className="bg-sky-500 hover:bg-sky-700 text-white border border-sky-500 rounded-4xl active:bg-sky-600 px-4 py-2 mt-4"
      >
        Login With Spotify
      </button>
      {isLoading && <div>Carregando...</div>}
    </>
  );
}

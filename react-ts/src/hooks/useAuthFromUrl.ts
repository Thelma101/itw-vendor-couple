import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Reads auth token & role from URL query params (set by signup-flow redirect)
 * and stores them in localStorage. Cleans the URL afterwards.
 */
export function useAuthFromUrl() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (token && token !== 'null') {
      localStorage.setItem('authToken', token);
      if (role) {
        localStorage.setItem('userRole', role);
      }

      // Remove token & role from URL to keep it clean
      searchParams.delete('token');
      searchParams.delete('role');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
}

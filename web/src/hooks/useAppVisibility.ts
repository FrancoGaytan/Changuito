import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Refetch inmediato de las queries especificadas cuando el usuario
 * vuelve a la app/tab (evento visibilitychange).
 * Útil en mobile: el usuario cambia de app y al volver ve los datos frescos.
 *
 * Uso: useAppVisibility(['lists', listId, 'items'])
 * Sin argumentos: refetch de TODAS las queries activas.
 */
export function useAppVisibility(queryKey?: unknown[]) {
  const qc = useQueryClient();

  useEffect(() => {
    const handleVisible = () => {
      if (document.visibilityState === 'visible') {
        if (queryKey) {
          qc.invalidateQueries({ queryKey });
        } else {
          qc.invalidateQueries();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, [qc, queryKey]);
}

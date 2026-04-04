import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJoinFamily } from '@/features/family/hooks/useFamily';
import { useAuthStore } from '@/store/authStore';
import { Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function JoinFamilyPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const joinFamily = useJoinFamily();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!code || attempted) return;

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingJoinCode', code);
      navigate('/login', { replace: true });
      return;
    }

    setAttempted(true);
    joinFamily.mutate(code, {
      onSuccess: () => {
        setTimeout(() => navigate('/mi-familia', { replace: true }), 2000);
      },
    });
  }, [code, isAuthenticated, attempted, joinFamily, navigate]);

  return (
    <div
      className="min-h-svh flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)' }}
    >
      <div className="w-full max-w-sm bg-white rounded-[28px] shadow-2xl p-8 text-center">
        {joinFamily.isPending && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">
              Uniéndote al grupo...
            </h2>
            <p className="text-stone-500 text-sm">
              Estamos procesando tu solicitud.
            </p>
          </>
        )}

        {joinFamily.isSuccess && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1b5e20] mb-2">
              ¡Te uniste al grupo!
            </h2>
            <p className="text-stone-500 text-sm mb-6">
              Redirigiendo a tu familia...
            </p>
          </>
        )}

        {joinFamily.isError && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">
              No se pudo unir
            </h2>
            <p className="text-stone-500 text-sm mb-6">
              El código puede ser inválido o ya pertenecés a un grupo.
            </p>
            <Link
              to="/mi-familia"
              className="inline-flex items-center gap-2 bg-[#1b5e20] hover:bg-[#154c19] text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-lg shadow-green-900/20"
            >
              <Users className="w-4 h-4" />
              Ir a Mi Familia
            </Link>
          </>
        )}

        {!joinFamily.isPending && !joinFamily.isSuccess && !joinFamily.isError && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-stone-800 mb-2">
              Invitación familiar
            </h2>
            <p className="text-stone-500 text-sm">
              Preparando tu solicitud...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';

interface ForgotForm {
  email: string;
}

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();
  const forgot = useForgotPassword();

  const onSubmit = ({ email }: ForgotForm) => forgot.mutate(email);

  return (
    <div className="min-h-svh flex flex-col items-center justify-between px-4 py-8 bg-gradient-to-br from-teal-200 via-teal-500 to-teal-900">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🛒</span>
          </div>
          <h1 className="font-brand text-3xl text-white drop-shadow-sm">Changuito</h1>
          <p className="text-teal-100 text-[10px] uppercase tracking-[0.25em] mt-1">Organización Digital</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {forgot.isSuccess ? (
            <div className="text-center py-2">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-lg font-bold text-stone-800 mb-2">¡Revisá tu correo!</h2>
              <p className="text-stone-400 text-sm leading-relaxed">
                Si el email existe en nuestra base de datos, recibiste un enlace para restablecer tu contraseña.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block text-teal-600 text-sm font-medium hover:underline"
              >
                ← Volver al login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-stone-800 mb-2">¿Olvidaste tu contraseña?</h2>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Ingresá tu email para recibir un enlace de recuperación.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="text-[11px] font-medium text-stone-500 block mb-1">Email</label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-shadow"
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
                </div>

                {forgot.error && (
                  <p role="alert" className="text-red-500 text-xs text-center bg-red-50 rounded-lg py-2">
                    Algo salió mal. Intentá de nuevo.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={forgot.isPending}
                  className="w-full bg-green-700 hover:bg-green-800 active:scale-[.98] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-all cursor-pointer"
                >
                  {forgot.isPending ? 'Enviando...' : 'Enviar Enlace →'}
                </button>
              </form>

              <div className="text-center mt-5">
                <Link to="/login" className="text-stone-400 text-sm hover:text-stone-600 transition-colors">
                  ← Volver al login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Testimonial decorativo */}
      <div className="flex items-center gap-3 mt-8 mb-2 max-w-sm">
        <div className="w-8 h-8 rounded-full bg-white/30 shrink-0 flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
      </div>
    </div>
  );
}

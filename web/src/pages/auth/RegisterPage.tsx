import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useRegister } from '@/features/auth/hooks/useAuth';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
  terms: boolean;
}

export function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const onSubmit = ({ name, email, password }: RegisterForm) =>
    registerMutation.mutate({ name, email, password });

  return (
    <div className="min-h-svh flex">
      {/* Panel izquierdo — solo desktop */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-[#1b4332]">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b4332] via-transparent to-transparent opacity-80" />
        
        <div className="relative z-10">
          <h1 className="font-brand text-6xl text-white drop-shadow-md leading-tight">Changuito</h1>
          <p className="text-emerald-300 font-semibold text-2xl mt-4 max-w-sm">
            Tu despensa digital, con alma de barrio.
          </p>
          <p className="text-[#a7f3d0] text-[15px] mt-6 leading-relaxed max-w-[320px]">
            Organizá tus compras, gestioná tu inventario y compartí listas con tu familia de la manera más sencilla y cálida.
          </p>
          <div className="flex gap-4 mt-10">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-emerald-50 text-[13px] font-medium tracking-wide">
              Listas Inteligentes
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-emerald-50 text-[13px] font-medium tracking-wide">
              Inventario Vivo
            </span>
          </div>
        </div>
        <p className="relative z-10 text-emerald-500/80 text-[11px] font-bold tracking-widest uppercase">
          Abrazado por el consumo consciente — 2026
        </p>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-[#4ADE80]" 
           style={{ background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)' }}>
        
        {/* Decorative large circle */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Logo mobile */}
        <div className="text-center mb-8 lg:hidden relative z-10">
          <h1 className="font-brand text-4xl text-white drop-shadow-sm">Changuito</h1>
          <p className="text-white/90 text-[10px] uppercase tracking-[0.3em] font-bold mt-1">Organización Digital</p>
        </div>

        <div className="w-full max-w-[400px] bg-white rounded-[28px] shadow-2xl p-8 lg:p-10 relative z-10">
          <h2 className="text-[22px] font-bold text-[#1b5e20] tracking-tight uppercase">Crear Cuenta</h2>
          <p className="text-stone-500 text-[13px] mt-1 mb-8">Empezá a organizar tus compras.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">Nombre</label>
              <div className="flex items-center bg-[#f4f5f5] border border-stone-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl px-4 py-3.5 transition-colors">
                <User className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
                  {...register('name', { required: 'El nombre es obligatorio' })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">Email</label>
              <div className="flex items-center bg-[#f4f5f5] border border-stone-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl px-4 py-3.5 transition-colors">
                <Mail className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="reg-password" className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">Contraseña</label>
              <div className="flex items-center bg-[#f4f5f5] border border-stone-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl px-4 py-3.5 transition-colors">
                <Lock className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-stone-400 hover:text-stone-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="reg-confirm" className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">Confirmar contraseña</label>
              <div className="flex items-center bg-[#f4f5f5] border border-stone-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl px-4 py-3.5 transition-colors">
                <Lock className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
                  {...register('confirm', {
                    required: 'Confirmá tu contraseña',
                    validate: (v) => v === watch('password') || 'Las contraseñas no coinciden',
                  })}
                />
              </div>
              {errors.confirm && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{errors.confirm.message}</p>}
            </div>

            {/* Términos */}
            <label className="flex items-start gap-3 cursor-pointer select-none pt-2 ml-1">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px] peer appearance-none border-2 border-stone-300 rounded-[4px] checked:bg-[#1b5e20] checked:border-[#1b5e20] transition-colors cursor-pointer"
                  {...register('terms', { required: 'Necesario' })}
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="text-[11.5px] text-stone-500 leading-relaxed font-medium">
                Acepto los <a href="#" className="underline font-bold text-emerald-700 hover:text-emerald-800">Términos de Servicio</a> y la <a href="#" className="underline font-bold text-emerald-700 hover:text-emerald-800">Privacidad</a>.
              </span>
            </label>
            {errors.terms && <p className="text-red-500 text-[11px] ml-1 font-medium leading-none">{errors.terms.message}</p>}

            {/* Error del server */}
            {registerMutation.error && (
              <p role="alert" className="text-red-500 text-[12px] text-center bg-red-50/80 rounded-xl py-2.5 font-medium border border-red-100">
                Algo salió mal. Intentá de nuevo.
              </p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#1b5e20] hover:bg-[#154c19] active:scale-[.98] disabled:opacity-70 text-white font-bold py-4 rounded-2xl text-[15px] transition-all cursor-pointer shadow-lg shadow-green-900/20 mt-6"
            >
              {registerMutation.isPending ? 'Procesando...' : 'Registrarme ahora →'}
            </button>
          </form>
        </div>

        <p className="text-white/90 text-[14px] mt-8 relative z-10">
          ¿Ya tenes cuenta?{' '}
          <Link to="/login" className="font-bold text-white hover:underline decoration-2 underline-offset-4">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

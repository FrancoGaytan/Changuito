import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, ShoppingBasket, Truck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { authLocale } from '@/locale/authLocale';

const l = authLocale;

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const onSubmit = (data: LoginForm) => login.mutate(data);

  return (
    <div className="min-h-svh bg-[#4ADE80] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden" 
         style={{ background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)' }}>
      
      {/* Decorative large circle (like the figma) */}
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Logo Area */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="font-brand text-[44px] text-white tracking-normal leading-none drop-shadow-sm">{l.brand}</h1>

      </div>

      {/* Main Card */}
      <div className="w-full max-w-[380px] bg-white rounded-[28px] shadow-2xl p-8 relative z-10">
        <h2 className="text-[22px] font-bold text-stone-800 tracking-tight">{l.login.title}</h2>
        <p className="text-stone-500 text-[13px] mt-1 mb-6">{l.login.subtitle}</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5 ml-1">{l.login.email.label}</label>
            <div className="flex items-center bg-[#f4f5f5] border border-stone-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl px-4 py-3.5 transition-colors">
              <Mail className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={l.login.email.placeholder}
                className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
                {...register('email', {
                  required: l.login.email.errors.required,
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: l.login.email.errors.pattern },
                })}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
              <label htmlFor="password" className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">{l.login.password.label}</label>
              <Link to="/recuperar-contrasena" className="text-[11px] text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                {l.login.password.forgot}
              </Link>
            </div>
            <div className="flex items-center bg-[#f4f5f5] border border-stone-200 focus-within:border-emerald-500 focus-within:bg-white rounded-2xl px-4 py-3.5 transition-colors">
              <Lock className="w-5 h-5 text-stone-400 mr-3 flex-shrink-0" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="bg-transparent border-none outline-none w-full text-[15px] text-stone-800 placeholder:text-stone-400"
                {...register('password', {
                  required: l.login.password.errors.required,
                  minLength: { value: 6, message: l.login.password.errors.minLength },
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

          {/* Server Error */}
          {login.error && (
            <p role="alert" className="text-red-500 text-[12px] text-center bg-red-50/80 rounded-xl py-2.5 font-medium border border-red-100">
              {l.login.serverError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-[#1b5e20] hover:bg-[#154c19] active:scale-[.98] disabled:opacity-70 text-white font-bold py-4 rounded-2xl text-[15px] transition-all cursor-pointer shadow-lg shadow-green-900/20 mt-6"
          >
            {login.isPending ? l.login.submit.pending : l.login.submit.default}
          </button>
        </form>
      </div>

      {/* Create Account Link */}
      <p className="text-white/90 text-[14px] mt-8 relative z-10">
        {l.login.noAccount}{' '}
        <Link to="/register" className="font-bold text-white hover:underline decoration-2 underline-offset-4">
          {l.login.createAccount}
        </Link>
      </p>

      {/* Decorative Bottom Icons / Terms */}
      <div className="absolute bottom-6 flex flex-col items-center gap-3 opacity-60">
        <div className="flex gap-6 text-white">
          <ShoppingBasket className="w-5 h-5" />
          <Truck className="w-5 h-5" />
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
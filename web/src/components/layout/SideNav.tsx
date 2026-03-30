import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCart, Package, Users, LogOut } from 'lucide-react';

const navItems = [
  { to: '/mis-listas', label: 'Mis Listas', icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/mi-familia', label: 'Mi Familia', icon: Users },
];

export function SideNav() {
  const { user, clearAuth } = useAuthStore();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col border-r border-stone-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-stone-100">
        <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-emerald-700" />
        </div>
        <span className="text-lg font-bold text-[#1b5e20] tracking-tight">Changuito</span>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-[#1b5e20] shadow-sm'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      {user && (
        <div className="border-t border-stone-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-emerald-800">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-700 truncate">{user.name}</p>
              <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={clearAuth}
            className="mt-3 flex items-center gap-2 text-xs text-stone-400 hover:text-red-500 transition-colors w-full px-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}

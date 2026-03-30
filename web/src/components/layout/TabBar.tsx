import { NavLink } from 'react-router-dom';
import { ShoppingCart, Package, Users } from 'lucide-react';

const navItems = [
  { to: '/mis-listas', label: 'Listas', icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/mi-familia', label: 'Familia', icon: Users },
];

export function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-stone-200 bg-white/95 backdrop-blur-lg md:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-[#1b5e20]' : 'text-stone-400'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

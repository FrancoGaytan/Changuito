import {
  ShoppingCart,
  Store,
  Flame,
  Carrot,
  Beef,
  Sparkles,
  Pill,
  Leaf,
} from 'lucide-react';

export const themeConfig: Record<string, { 
  label: string; 
  icon: any; 
  color: string; 
  bg: string; 
  tag: string;
  tagClass: string;
  bgImage: string; 
}> = {
  default: { 
    label: 'General', 
    icon: ShoppingCart, 
    color: 'text-stone-700', 
    bg: 'bg-stone-100', 
    tag: 'Básico',
    tagClass: 'bg-stone-200 text-stone-700',
    bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' 
  },
  supermercado: { 
    label: 'Supermercado', 
    icon: Store, 
    color: 'text-amber-800', 
    bg: 'bg-amber-200', 
    tag: 'Mensual',
    tagClass: 'bg-amber-100/80 text-amber-800',
    bgImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800' 
  },
  verduleria: { 
    label: 'Verdulería', 
    icon: Carrot, 
    color: 'text-green-800', 
    bg: 'bg-[#a7f3d0]', 
    tag: 'Prioridad Alta',
    tagClass: 'bg-[#d1fae5]/80 text-green-800',
    bgImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' 
  },
  carniceria: { 
    label: 'Carnicería', 
    icon: Beef, 
    color: 'text-red-800', 
    bg: 'bg-red-200', 
    tag: 'Fresco',
    tagClass: 'bg-red-100/80 text-red-800',
    bgImage: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800' 
  },
  limpieza: { 
    label: 'Limpieza', 
    icon: Sparkles, 
    color: 'text-sky-800', 
    bg: 'bg-sky-200', 
    tag: 'Reponer',
    tagClass: 'bg-sky-100/80 text-sky-800',
    bgImage: 'https://images.unsplash.com/photo-1584820927498-cafe6c15cf08?auto=format&fit=crop&q=80&w=800' 
  },
  farmacia: { 
    label: 'Farmacia', 
    icon: Pill, 
    color: 'text-teal-800', 
    bg: 'bg-teal-200', 
    tag: 'Salud',
    tagClass: 'bg-teal-100/80 text-teal-800',
    bgImage: 'https://images.unsplash.com/photo-1584308666744-24d5e4a83cc4?auto=format&fit=crop&q=80&w=800' 
  },
  dietetica: { 
    label: 'Dietética', 
    icon: Leaf, 
    color: 'text-lime-800', 
    bg: 'bg-lime-200', 
    tag: 'Sano',
    tagClass: 'bg-lime-100/80 text-lime-800',
    bgImage: 'https://images.unsplash.com/photo-1606148386129-d50d0354cfdd?auto=format&fit=crop&q=80&w=800' 
  },
  asado: { 
    label: 'Asado', 
    icon: Flame, 
    color: 'text-orange-800', 
    bg: 'bg-orange-200', 
    tag: 'Encuentro',
    tagClass: 'bg-orange-100/80 text-orange-800',
    bgImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800' 
  },
};

import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { SideNav } from './SideNav';

export function AppLayout() {
  return (
    <div className="flex h-screen bg-stone-50">
      {/* Side Nav — visible solo en desktop */}
      <SideNav />

      {/* Contenido principal */}
      <main
        className="flex-1 overflow-y-auto md:pb-0"
        style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}
      >
        <Outlet />
      </main>

      {/* Tab Bar — visible solo en mobile */}
      <TabBar />
    </div>
  );
}

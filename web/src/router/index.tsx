import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ListsPage } from '@/pages/ListsPage';
import { ListDetailPage } from '@/pages/ListDetailPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { FamilyPage } from '@/pages/FamilyPage';
import { JoinFamilyPage } from '@/pages/JoinFamilyPage';
import { AuthGuard } from './AuthGuard';

export const router = createBrowserRouter([
  // Auth routes (sin layout principal)
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/recuperar-contrasena', element: <ForgotPasswordPage /> },

  // Join family via QR/code
  { path: '/join/:code', element: <JoinFamilyPage /> },

  // Protected routes (con layout principal)
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/mis-listas" replace /> },
      { path: '/mis-listas', element: <ListsPage /> },
      { path: '/mis-listas/:id', element: <ListDetailPage /> },
      { path: '/inventario', element: <InventoryPage /> },
      { path: '/mi-familia', element: <FamilyPage /> },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/mis-listas" replace /> },
]);

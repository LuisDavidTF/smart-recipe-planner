// app/login/page.jsx
'use client' // La página usa un componente de cliente

import { AuthForm } from '@components/auth/AuthForm'; // Ajusta la ruta

export default function LoginPage() {
  // Pasamos 'isRegister={false}' (o nada, ya que es el default)
  return <AuthForm isRegister={false} />;
}
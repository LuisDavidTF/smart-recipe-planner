// app/register/page.jsx
'use client' // La página usa un componente de cliente

import { AuthForm } from '@components/auth/AuthForm'; // Ajusta la ruta

export default function RegisterPage() {
  // Pasamos 'isRegister={true}'
  return <AuthForm isRegister={true} />;
}
'use client' 

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/Button'; 

export default function GlobalErrorPage({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
  }, [error]);

  let friendlyMessage = 'Ocurrió un error inesperado.';
  
  if (error.message === 'No se pudo cargar la receta') {
    friendlyMessage = 'No pudimos cargar esta receta. Es posible que sea privada, que no exista o que haya un error de conexión.';
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-red-600 mb-4">¡Ups! Algo salió mal</h2>
      <p className="text-lg text-gray-700">{friendlyMessage}</p>
      
      <div className="flex gap-4 justify-center mt-8">
        <Button 
          onClick={() => router.push('/')} 
          variant="secondary"
        >
          Volver al inicio
        </Button>
        <Button 
          onClick={
            () => reset()
          }
        >
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { WifiIcon } from '@components/ui/Icons';
import { Button } from '@components/ui/Button';

export default function OfflineFallback() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background text-foreground transition-colors duration-300">
            <div className="bg-muted p-6 rounded-full mb-6 animate-pulse">
                <WifiIcon className="w-12 h-12 text-muted-foreground" />
            </div>

            <h1 className="text-2xl font-bold mb-3 font-serif">
                Sin Conexión
            </h1>

            <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                Parece que no tienes internet. Esta página no está guardada en tu dispositivo.
            </p>

            <div className="space-y-4 w-full max-w-xs">
                <Button
                    onClick={() => window.location.reload()}
                    className="w-full"
                >
                    Reintentar
                </Button>

                <Button
                    variant="secondary"
                    onClick={() => window.location.href = '/'}
                    className="w-full"
                >
                    Ir al Inicio (Guardado)
                </Button>
            </div>
        </div>
    );
}

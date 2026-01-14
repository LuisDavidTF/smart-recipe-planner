import React from 'react';
import { Spinner } from '@components/ui/Spinner';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
            <Spinner size="lg" className="text-emerald-500" />
            <p className="mt-4 text-gray-500 animate-pulse font-medium">Cargando receta...</p>
        </div>
    );
}

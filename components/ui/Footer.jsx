'use client';

import React from 'react';
import Link from 'next/link';
import { useSettings } from '@context/SettingsContext';

export function Footer() {
    const { t } = useSettings();

    return (
        <footer className="mt-16 pb-8 text-center" role="contentinfo">
            <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Culina Smart. {t.common?.rights || 'Todos los derechos reservados.'}
            </p>
            <div className="mt-2 flex justify-center gap-4">
                <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Términos y Condiciones
                </Link>
                <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Política de Privacidad
                </Link>
            </div>
        </footer>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useSettings } from '@context/SettingsContext';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useSettings();

    useEffect(() => {
        // Check if user has already accepted cookies
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Short delay to show banner after initial load for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg transition-transform duration-500 ease-in-out transform translate-y-0">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-foreground/90 leading-relaxed text-center md:text-left">
                    <p>
                        {t.cookie?.text || 'Utilizamos cookies propias y de terceros...'}
                    </p>
                    <p className="mt-1">
                        {t.cookie?.accept || 'Al hacer clic en "Aceptar" o continuar navegando, usted acepta nuestra '}
                        <Link href="/privacy" className="font-medium text-primary hover:underline underline-offset-4">
                            {t.auth.privacyLink}
                        </Link>
                        {t.auth.and}
                        <Link href="/terms" className="font-medium text-primary hover:underline underline-offset-4">
                            {t.auth.termsLink}
                        </Link>
                        .
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Button
                        onClick={acceptCookies}
                        className="whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
                    >
                        {t.cookie?.btn || 'Aceptar y Continuar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

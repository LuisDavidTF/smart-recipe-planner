'use client';

import React, { useState } from 'react';
import { useSettings } from '@context/SettingsContext';

/**
 * SmartImage Component
 * Conditionally renders an image based on user's Data Saver settings.
 * Replaces standard <img> tag.
 */
export function SmartImage({ src, alt, className, ...props }) {
    const { shouldLoadImage } = useSettings();
    const [forceLoad, setForceLoad] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Fallback immediately if no source
    const effectiveSrc = src || 'https://placehold.co/600x400?text=No+Image';

    // Decide whether to show the real image
    const showImage = forceLoad || shouldLoadImage();

    if (!showImage) {
        return (
            <div
                className={`${className} bg-gray-200 flex flex-col items-center justify-center cursor-pointer group hover:bg-gray-300 transition-colors relative overflow-hidden`}
                onClick={(e) => {
                    e.stopPropagation();
                    setForceLoad(true);
                }}
                role="button"
                aria-label="Cargar imagen"
            >
                <div className="text-center p-2 z-10">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Tocar para ver</span>
                </div>

                {/* Blurred minimalist placeholder background if available */}
                <div className="absolute inset-0 opacity-10 blur-xl bg-gradient-to-br from-emerald-100 to-gray-200" />
            </div>
        );
    }

    return (
        <img
            src={effectiveSrc}
            alt={alt}
            className={`${className} object-cover`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={(e) => {
                // Fallback if image fails
                e.target.src = 'https://placehold.co/600x400?text=No+Image';
                setLoaded(true);
            }}
            {...props}
        />
    );
}

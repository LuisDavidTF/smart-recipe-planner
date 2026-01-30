'use client';

import React from 'react';
import { SparklesIcon, PantryIcon, UserIcon, CalendarIcon } from '@components/ui/Icons';

export function FeaturesSection() {
    const features = [
        {
            title: "Recetas con IA",
            description: "Nuestra inteligencia artificial analiza tus ingredientes disponibles para sugerirte recetas deliciosas y evitar el desperdicio de alimentos.",
            Icon: SparklesIcon,
        },
        {
            title: "Gestión de Despensa",
            description: "Mantén un inventario digital de tu cocina. Recibe alertas de caducidad y sabe siempre qué tienes a mano.",
            Icon: PantryIcon,
        },
        {
            title: "Comunidad Activa",
            description: "Comparte tus propias creaciones culinarias y descubre recetas de chefs caseros de todo el mundo.",
            Icon: UserIcon,
        },
        {
            title: "Planificación Semanal",
            description: "Organiza tus menús semanales con facilidad y genera listas de compras automáticas.",
            Icon: CalendarIcon,
        }
    ];

    return (
        <section className="py-16 bg-muted/30 border-y border-border">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                        Todo lo que necesitas para cocinar mejor
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Culina Smart no es solo un recetario, es tu asistente personal de cocina.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <feature.Icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
